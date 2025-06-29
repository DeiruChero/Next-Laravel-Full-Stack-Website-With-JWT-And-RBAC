<?php

namespace App\Http\Controllers;

use App\Models\DesignationModel;
use App\Models\DistributorModel;
use App\Models\EmployeeModel;
use Illuminate\Http\Request;
use DB;

class DeliveryBoyController extends Controller
{
    public function index(Request $request)
    {
        $query = EmployeeModel::query();
        if ($search = $request->input('search')) {
            $query->where('EmployeeName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $employees = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $employees->map(function ($employee) {
            return [
                'EmployeeID' => $employee->EmployeeID,
                'DesignationName' => $employee->designation->DesignationName,
                'EmployeeName' => $employee->EmployeeName,
                'Mobile' => $employee->Mobile,
                'Email' => $employee->Email,
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
            'Mobile' => 'required|unique:EmployeeModels,Mobile',
            'Email' => 'required|email|unique:EmployeeModels,Email',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'Address' => 'required|string',
        ]);
        DB::beginTransaction();
        try {

            $authUser = auth()->user();
            $userid = auth()->id();
            $createdBy = $authUser->UserID;

            $newInstiId = (EmployeeModel::max('EmployeeID') ?? 0) + 1;
            $designation = DesignationModel::where('DesignationName', 'Delivery Boy')->first();
            $distributor = DistributorModel::where('UserID', $userid)->first();

            if (!$designation) {
                return response()->json([
                    'error' => 'Designation "Delivery Boy" not found.'
                ], 422);
            }

            $designationId = $designation->DesignationID;
            $distributorId = $distributor->DistributorID;

            EmployeeModel::create([
                'EmployeeID' => $newInstiId,
                'EmployeeName' => $request->DeliveryBoyName,
                'Mobile' => $request->Mobile,
                'Email' => $request->Email,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'PinCode' => $request->PinCode,
                'UserID' => $userid,
                'created_by' => $createdBy,
                'Password' => $request->Password,
                'Gender' => $request->Gender,
                'DateofBirth' => $request->DateofBirth,
                'DateJoined' => $request->DateJoined,
                'Salary' => $request->Salary,
                'DesignationID' => $designationId,
                'DistributorID' => $distributorId
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Delivery Boy created successfully.'
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
        $employee = EmployeeModel::find($id);
        if (!$employee) {
            return response()->json([
                'error' => 'Delivery Boy not found.'
            ], 404);
        }
        return response()->json([
            'data' => $employee
        ], 200);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'Mobile' => 'required|unique:EmployeeModels,Mobile',
            'Email' => 'required|email|unique:EmployeeModels,Email',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'Address' => 'required|string',
        ]);
        $userId = auth()->id();
        $employee = EmployeeModel::find($id);
        if (!$employee) {
            return response()->json(['error' => 'Delivery Boy not found'], 404);
        }
        $employee->update([
            'EmployeeName' => $request->DeliveryBoyName,
            'Mobile' => $request->Mobile,
            'Email' => $request->Email,
            'Address' => $request->Address,
            'Area' => $request->Area,
            'City' => $request->City,
            'State' => $request->State,
            'PinCode' => $request->PinCode,
            'UserID' => $userId,
            'Gender' => $request->Gender,
            'DateofBirth' => $request->DateofBirth,
            'DateJoined' => $request->DateJoined,
            'Salary' => $request->Salary,
            'updated_by' => $userId
        ]);
        return response()->json([
            'message' => 'Delivery Boy updated successfully.'
        ], 200);
    }
}
