<?php

namespace App\Http\Controllers;

use App\Models\BranchModel;
use App\Models\OrderModel;
use App\Models\RequisitionModel;
use App\Models\RequisitionTransModel;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;

class RequisitionController extends Controller
{
    public function getRequisitionTitle(Request $request)
    {
        $user = auth()->user();

        $today = Carbon::now();

        $branchid = $user->BranchID != 0
            ? $user->BranchID
            : ($request->input('branchid') ?? null);

        $branch = BranchModel::find($branchid);
        if (!$branch) {
            return response()->json([
                'status' => 'error',
                'message' => 'Branch not found.'
            ], 404);
        }

        $count = RequisitionModel::where('BranchID', $branchid)
            ->whereDate('RequisitionDate', $today)
            ->count('RequisitionID');

        $shortname = $branch->ShortName;

        $title = $shortname . '-Indent-' . ($count + 1) . '(' . $today->format('d-m-Y H:i:s') . ')';

        return response()->json([
            'title' => $title,
            'status' => 'success',
            'message' => 'Requisition title fetched successfully',
        ], 200);
    }
    public function createRequisition(Request $request) // need to change here 
    {
        $user = auth()->user();

        $branchid = $user->BranchID != 0
            ? $user->BranchID
            : ($request->input('branchid') ?? null);

        $title = $request->input('title');
        $orderList = $request->input('list');

        if (empty($orderList)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No orders found.'
            ], 404);
        }

        $today = Carbon::now();

        try {

            DB::beginTransaction();

            OrderModel::whereIn('OrderID', $orderList)
                ->update(['OrderStatus' => 'UnAssigned']);

            $newReqId = (RequisitionModel::max('RequisitionID') ?? 0) + 1;

            RequisitionModel::create([
                'RequisitionID' => $newReqId,
                'RequisitionDate' => $today->format('Y-m-d H:i:s'),
                'RequisitionTitle' => $title,
                'BranchID' => $branchid,
            ]);

            $newTransId = (RequisitionTransModel::max('RequisitionTransID') ?? 0) + 1;
            $transData = [];

            foreach ($orderList as $orderID) {
                $transData[] = [
                    'RequisitionTransID' => $newTransId++,
                    'OrderID' => $orderID,
                    'RequisitionID' => $newReqId,
                ];
            }

            RequisitionTransModel::insert($transData);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Requisition created successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create requisition',
                'error' => $e->getMessage(),
            ], 500);
        }

    }
}
