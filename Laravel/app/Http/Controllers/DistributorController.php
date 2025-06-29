<?php

namespace App\Http\Controllers;

use App\Models\CustomerModel;
use App\Models\DistributorModel;
use App\Models\OrderModel;
use Illuminate\Http\Request;

class DistributorController extends Controller
{
    
    public function distributorCustomerList (Request $request){

        $userid = auth()->id();

        $distributor = DistributorModel::where('UserID', $userid)->first();
        if(!$distributor){
            return response()->json([
                'status' => 'error',
                'message' => 'Distributor not found.'
            ], 404);
        }

        $distributorid = $distributor->DistributorID;

         $query = CustomerModel::where('DistributorID', $distributorid);

        if ($search = $request->input('search')) {
            $query->where('CustomerName', 'like', "%$search%");
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

         $customers = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Customers fetched successfully.',
                'data' => $customers,
                'total' => $total,
            ]);
    }

    public function distributorDeliveryBoyList(Request $request){
         $userid = auth()->id();

        $distributor = DistributorModel::where('UserID', $userid)->first();
        if(!$distributor){
            return response()->json([
                'status' => 'error',
                'message' => 'Distributor not found.'
            ], 404);
        }

        $distributorid = $distributor->DistributorID;

         $query = CustomerModel::where('DistributorID', $distributorid);

        if ($search = $request->input('search')) {
            $query->where('CustomerName', 'like', "%$search%");
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

         $customers = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Customers fetched successfully.',
                'data' => $customers,
                'total' => $total,
            ]);
    }

    public function distributorAllOrdersList (Request $request) {

        $userid = auth()->id();

        $distributor = DistributorModel::where('UserID', $userid)->first();
        if(!$distributor){
            return response()->json([
                'status' => 'error',
                'message' => 'Distributor not found.'
            ], 404);
        }

        $distributorid = $distributor->DistributorID;

         $query = OrderModel::whereHas('customer', function ($q) use ($distributorid){
            $q->where('DistributorID', $distributorid );
         })->with('customer');

        if ($search = $request->input('search')) {
            $query->where('OrderID', 'like', "%$search%");
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

         $orders = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Orders fetched successfully.',
                'data' => $orders,
                'total' => $total,
            ]);

    }

}
