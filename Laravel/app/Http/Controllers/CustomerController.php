<?php

namespace App\Http\Controllers;

use App\Models\CustomerModel;
use App\Models\UserRecoveryModel;
use Faker\Provider\ar_EG\Address;
use Hash;
use Illuminate\Http\Request;
use DB;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomerModel::query();
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
        $formatted = $customers->map(function ($customer) {
            return [
                'CustomerID' => $customer->CustomerID,
                'CustomerName' => $customer->CustomerName,
                'Mobile' => $customer->Mobile,
                'Email' => $customer->Email,
                'Area' => $customer->Area,
                'City' => $customer->City,
                'State' => $customer->State,
                'PinCode' => $customer->PinCode,
            ];
        });
        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ], 200);
    }
    public function show($id)
    {
        $customer = CustomerModel::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }
        return response()->json($customer);
    }
    public function destroy($id)
    {
        $customer = CustomerModel::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }
        $customer->delete();
        return response()->json(['message' => 'Customer deleted successfully'], 200);
    }
    public function store(Request $request)
    {
        $request->validate([
            'CustomerName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:CustomerModels,Mobile',
            'WhatsApp' => 'nullable|digits:10',
            'Email' => 'required|email|unique:CustomerModels,Email',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'Address' => 'required|string|max:255',
            'IsUnderDistributor' => 'required|bool'
        ]);
        DB::beginTransaction();
        try {

            $authUser = auth()->user();
            $createdBy = $authUser->UserID;
            $newCustomerId = (CustomerModel::max('CustomerID') ?? 0) + 1;

            CustomerModel::create(
                [
                    'CustomerID' => $newCustomerId,
                    'CustomerName' => $request->CustomerName,
                    'Mobile' => $request->Mobile,
                    'WhatsApp' => $request->WhatsApp,
                    'Email' => $request->Email,
                    'Address' => $request->Address,
                    'Area' => $request->Area,
                    'City' => $request->City,
                    'State' => $request->State,
                    'Country' => 'India',
                    'PinCode' => $request->PinCode,
                    'UserID' => $createdBy,
                    'DistributorID' => $request->DistributorID ?? 0,
                    'IsUnderDistributor' => $request->IsUnderDistributor ?? false,
                    'created_by' => $createdBy,
                ]
            );

            DB::commit();

            return response()->json([
                'message' => ' Customer created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'CustomerName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:CustomerModels,Mobile',
            'WhatsApp' => 'nullable|digits:10',
            'Email' => 'required|email|unique:CustomerModels,Email',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'Address' => 'required|string|max:255',
            'IsUnderDistributor' => 'required|bool'
        ]);
        $userId = auth()->id();

        $customer = CustomerModel::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }
        $customer->CustomerName = $request->CustomerName;
        $customer->Mobile = $request->Mobile;
        $customer->WhatsApp = $request->WhatsApp;
        $customer->Email = $request->Email;
        $customer->Area = $request->Area;
        $customer->City = $request->City;
        $customer->State = $request->State;
        $customer->PinCode = $request->PinCode;
        $customer->Address = $request->Address;
        $customer->IsUnderDistributor = $request->IsUnderDistributor;
        $customer->updated_by = $userId;
        $customer->save();
        return response()->json(['message' => 'Customer updated successfully'], 200);
    }

    public function changeCustomerPassword(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6|max:40',
        ]);

        $user = auth()->user();

        try {
            DB::beginTransaction();

            $user->Password = Hash::make($validated['password']);
            $user->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Password updated successfully.'
            ], 200);

        } catch (\Exception $e){
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update password.',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function deleteCustomerAccount(){

        $user = auth()->user();
        
        if(!$user){

           return response()->json([
            'status' => 'error',
            'message' => 'Unauthenticated user.'
           ], 401);
        }

        $recoveryData = $user->only([
            'UserID',
            'Picture',
            'DisplayName',
            'Mobile',
            'Email',
            'Password',
            'UserType',
            'Status',
            'BranchID',
            'created_by',
            'updated_by',
        ]);

        UserRecoveryModel::create($recoveryData);

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User account deleted successfully.'
        ]);
    }
}
