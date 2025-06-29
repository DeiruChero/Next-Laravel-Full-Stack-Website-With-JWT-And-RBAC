<?php

namespace App\Http\Controllers;

use App\Models\VenderModel;
use Illuminate\Http\Request;
use DB;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $query = VenderModel::query();
        if ($search = $request->input('search')) {
            $query->where('VenderName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $venders = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $venders->map(function ($vender) {
            return [
                'VenderID' => $vender->VenderID,
                'VenderName' => $vender->VenderName,
                'Mobile' => $vender->Mobile,
                'Area' => $vender->Area,
                'City' => $vender->City,
                'State' => $vender->State,
            ];
        });
        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ], 200);
    }
    public function store(Request $request)
    {
        $request->validate([
            'VenderName' => 'required|string|max:255',
            'GSTNo' => 'nullable|max:15',
            'VenderType' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:VenderModels,Mobile',
            'Email' => 'required|email|unique:VenderModels,Email',
            'WhatsApp' => 'nullable|digits:10',
            'Mobile2' => 'nullable|digits:10',
            'Mobile3' => 'nullable|digits:10',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'BenificiaryName' => 'nullable|string|max:255',
            'BankName' => 'nullable|string|max:255',
            'BranchName' => 'nullable|string|max:255',
            'AccountNo' => 'nullable|max:18',
        ]);
        DB::beginTransaction();
        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $venderId = (VenderModel::max('VenderID') ?? 0) + 1;

            VenderModel::create([
                'VenderID' => $venderId,
                'VenderName' => $request->VenderName,
                'GSTNo' => $request->GSTNo,
                'VenderType' => $request->VenderType,
                'Mobile' => $request->Mobile,
                'Email' => $request->Email,
                'WhatsApp' => $request->WhatsApp,
                'Mobile2' => $request->Mobile2,
                'Mobile3' => $request->Mobile3,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'PinCode' => $request->PinCode,
                'BenificiaryName' => $request->BenificiaryName,
                'BankName' => $request->BankName,
                'BranchName' => $request->BranchName,
                'AccountNo' => $request->AccountNo,
                'IFSCCode' => $request->IFSCCode,
                'created_at' => now(),
                'updated_at' => now(),
                'BranchID' => $branchId,
                'created_by' => $createdBy
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Vendor created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function show($id)
    {
        $vendor = VenderModel::find($id);
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }
        return response()->json($vendor);
    }
    public function destroy($id)
    {
        $vendor = VenderModel::find($id);
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }
        $vendor->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Vendor deleted successfully'
        ], 200);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'VenderName' => 'required|string|max:255',
            'GSTNo' => 'nullable|max:15',
            'VenderType' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:VenderModels,Mobile',
            'Email' => 'required|email|unique:VenderModels,Email',
            'WhatsApp' => 'nullable|digits:10',
            'Mobile2' => 'nullable|digits:10',
            'Mobile3' => 'nullable|digits:10',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'BenificiaryName' => 'nullable|string|max:255',
            'BankName' => 'nullable|string|max:255',
            'BranchName' => 'nullable|string|max:255',
            'AccountNo' => 'nullable|max:18',
        ]);
        $userId = auth()->id();
        $vendor = VenderModel::find($id);
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }
        $vendor->VenderName = $request->VenderName;
        $vendor->GSTNo = $request->GSTNo;
        $vendor->VenderType = $request->VenderType;
        $vendor->Mobile = $request->Mobile;
        $vendor->Email = $request->Email;
        $vendor->WhatsApp = $request->WhatsApp;
        $vendor->Mobile2 = $request->Mobile2;
        $vendor->Mobile3 = $request->Mobile3;
        $vendor->Address = $request->Address;
        $vendor->Area = $request->Area;
        $vendor->City = $request->City;
        $vendor->State = $request->State;
        $vendor->PinCode = $request->PinCode;
        $vendor->BenificiaryName = $request->BenificiaryName;
        $vendor->BankName = $request->BankName;
        $vendor->BranchName = $request->BranchName;
        $vendor->AccountNo = $request->AccountNo;
        $vendor->updated_by = $userId;
        $vendor->updated_at = now();
        $vendor->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Vendor updated successfully'
        ], 200);
    }
    public function selectVendorData()
    {
        $customerList = VenderModel::select('VenderID', 'VenderName')->get();
        return response()->json($customerList);
    }
    public function showInfo($id)
    {
        $vendor = VenderModel::find($id);
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }

        return response()->json([
            'VenderID' => $vendor->VenderID,
            'VenderName' => $vendor->VenderName,
            'Mobile' => $vendor->Mobile,
            'Email' => $vendor->Email,
            'Address' => $vendor->Address,
            'Area' => $vendor->Area,
            'City' => $vendor->City,
            'State' => $vendor->State,
            'PinCode' => $vendor->PinCode,
        ]);
    }
}
