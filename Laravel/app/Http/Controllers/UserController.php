<?php

namespace App\Http\Controllers;

use App\Models\AdminModel;
use App\Models\AreaModel;
use App\Models\BranchModel;
use App\Models\CustomerModel;
use App\Models\DeliveryAddressModel;
use App\Models\DistributorModel;
use App\Models\DriverModel;
use App\Models\EmployeeModel;
use App\Models\InstitutionModel;
use App\Models\QuickCommerceModel;
use App\Models\RoleModel;
use App\Models\RoleRulesModel;
use App\Models\RulesModel;
use App\Models\ShopManagerModel;
use App\Models\UserModel;
use App\Models\UserRulesModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = UserModel::with(['branch', 'role']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('DisplayName', 'like', "%$search%")
                    ->orWhere('Mobile', 'like', "%$search%")
                    ->orWhere('Email', 'like', "%$search%");
            });
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

        $users = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();

        $formatted = $users->map(function ($user) {
            return [
                'UserID' => $user->UserID,
                'DisplayName' => $user->DisplayName,
                'Mobile' => $user->Mobile,
                'Email' => $user->Email,
                'Status' => $user->Status,
                'BranchName' => $user->branch->ShortName ?? null,
                'RoleName' => $user->role->RoleName ?? null,
            ];
        });

        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ]);
    }

    public function userDashboard()
    {

        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 400);
        }

        $userId = $user->UserID;
        $roleId = $user->RoleID;
        $branchId = $user->BranchID;

        $branchName = BranchModel::where('BranchID', $branchId)->pluck('BranchName');
        $roleRuleIds = RoleRulesModel::where('RoleID', $roleId)->pluck('RulesID');
        $userRuleIds = UserRulesModel::where('UserID', $userId)->pluck('RulesID');
        $allRuleIds = $userRuleIds->merge($roleRuleIds)->unique();

        $rulesName = RulesModel::whereIn('RulesID', $allRuleIds)
            ->get(['RulesName', 'RulesGroup', 'Link']);

        return response()->json([
            'name' => $user->DisplayName,
            'role' => $user->role->RoleName ?? null,
            'RoleID' => $user->RoleID,
            'rules' => $allRuleIds,
            'rules names' => $rulesName,
            'branch name' => $branchName,
        ]);
    }
    public function show($id)
    {
        $user = UserModel::with('role', 'branch')->find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($user);
    }
    public function destroy($id)
    {
        $user = UserModel::find($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function storeShopManager(Request $request)
    {

        $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',

            'WhatsApp' => 'nullable|digits:10',
            'Address' => 'required',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Customer', $createdBy, $branchId, $imageName);

            $newShopManagerId = (ShopManagerModel::max('ShopManagerID') ?? 0) + 1;

            ShopManagerModel::create([
                'ShopManagerID' => $newShopManagerId,
                'ShopManagerName' => $request->DisplayName,
                'Mobile' => $request->Mobile,
                'WhatsApp' => $request->WhatsApp,
                'Email' => $request->Email,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'PinCode' => $request->PinCode,
                'Country' => 'India',
                'UserID' => $newUserId,
                'created_by' => $createdBy,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);

            DB::commit();

            return response()->json([
                'message' => 'Shop Manager created successfully!'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeAdmin(Request $request)
    {

        $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',

            'WhatsApp' => 'nullable|digits:10',
            'Address' => 'required',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Admin', $createdBy, $branchId, $imageName);

            $newAdminId = (AdminModel::max('AdminID') ?? 0) + 1;

            AdminModel::create([
                'AdminID' => $newAdminId,
                'AdminName' => $request->DisplayName,
                'Mobile' => $request->Mobile,
                'WhatsApp' => $request->WhatsApp,
                'Email' => $request->Email,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'PinCode' => $request->PinCode,
                'Country' => 'India',
                'UserID' => $newUserId,
                'created_by' => $createdBy,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);

            DB::commit();

            return response()->json([
                'message' => 'Admin User created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeInsti(Request $request)
    {

        $validated = $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',

            'OwnerName' => 'required|string|max:255',
            'ContactPersonName1' => 'required|string|max:255',
            'CPMobile1' => 'required|digits:10',
            'CPWhatsApp1' => 'nullable|digits:10',
            'CPEmail1' => 'nullable|email',
            'ContactPersonName2' => 'nullable|string|max:255',
            'CPMobile2' => 'nullable|digits:10',
            'CPWhatsApp2' => 'nullable|digits:10',
            'CPEmail2' => 'nullable|email',
            'GSTNo' => 'nullable|max:15',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'BillingPercent' => 'required|numeric',
            'EmployeeID' => 'required|integer',
            'PaymentMode' => 'required|string|max:255',
            'DeliveryTime' => 'nullable',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Customer', $createdBy, $branchId, $imageName);

            $newInstiId = (InstitutionModel::max('InstitutionID') ?? 0) + 1;

            InstitutionModel::create([
                'InstitutionID' => $newInstiId,
                'InstitutionName' => $request->DisplayName,
                'OwnerName' => $request->OwnerName,
                'OwnerMobile' => $request->Mobile,
                'ContactPersonName1' => $request->ContactPersonName1,
                'CPMobile1' => $request->CPMobile1,
                'CPWhatsApp1' => $request->CPWhatsApp1,
                'CPEmail1' => $request->CPEmail1,
                'ContactPersonName2' => $request->ContactPersonName2,
                'CPMobile2' => $request->CPMobile2,
                'CPWhatsApp2' => $request->CPWhatsApp2,
                'CPEmail2' => $request->CPEmail2,
                'InstitutionEmail' => $request->Email,
                'GSTNo' => $request->GSTNo,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'Country' => 'India',
                'PinCode' => $request->PinCode,
                'UserID' => $newUserId,
                'created_by' => $createdBy,
                'BillingPercent' => $request->BillingPercent,
                'EmployeeID' => $request->EmployeeID,
                'PaymentMode' => $request->PaymentMode,
                'PriceType' => $request->PriceType,
                'DeliveryTime' => $request->DeliveryTime,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);


            DB::commit();

            return response()->json([
                'message' => 'Institution User created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeNewInsti(Request $request)
    {

        $validated = $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',

            'OwnerName' => 'required|string|max:255',
            'OwnerMobile' => 'required|digits:10',
            'ContactPersonName1' => 'required|string|max:255',
            'CPMobile1' => 'required|digits:10',
            'CPWhatsApp1' => 'nullable|digits:10',
            'CPEmail1' => 'nullable|email',
            'ContactPersonName2' => 'nullable|string|max:255',
            'CPMobile2' => 'nullable|digits:10',
            'CPWhatsApp2' => 'nullable|digits:10',
            'CPEmail2' => 'nullable|email',
            'GSTNo' => 'nullable|max:15',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'BillingPercent' => 'required|numeric',
            'EmployeeID' => 'required|integer',
            'PaymentMode' => 'required|string|max:255',
            'DeliveryTime' => 'nullable',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->branchId;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Customer', $createdBy, $branchId, $imageName);

            $newInstiId = (InstitutionModel::max('InstitutionID') ?? 0) + 1;

            InstitutionModel::create([
                'InstitutionID' => $newInstiId,
                'InstitutionName' => $request->DisplayName,
                'OwnerName' => $request->OwnerName,
                'OwnerMobile' => $request->OwnerMobile,
                'ContactPersonName1' => $request->ContactPersonName1,
                'CPMobile1' => $request->CPMobile1,
                'CPWhatsApp1' => $request->CPWhatsApp1,
                'CPEmail1' => $request->CPEmail1,
                'ContactPersonName2' => $request->ContactPersonName2,
                'CPMobile2' => $request->CPMobile2,
                'CPWhatsApp2' => $request->CPWhatsApp2,
                'CPEmail2' => $request->CPEmail2,
                'InstitutionEmail' => $request->InstitutionEmail,
                'GSTNo' => $request->GSTNo,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'Country' => 'India',
                'PinCode' => $request->PinCode,
                'UserID' => $newUserId,
                'created_by' => $createdBy,
                'BillingPercent' => $request->BillingPercent,
                'EmployeeID' => $request->EmployeeID,
                'PaymentMode' => $request->PaymentMode,
                'PriceType' => 'NewInstitution',
                'DeliveryTime' => $request->DeliveryTime,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);

            DB::commit();

            return response()->json([
                'message' => 'New Institution User created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeQuickCommerce(Request $request)
    {

        $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',


            'PlatformGSTNo' => 'nullable|string|max:15',
            'ProductCode' => 'required|string|max:255',
            'ProductPrice' => 'required|string|max:255',
            'ContactPersonName1' => 'required|string|max:255',
            'CPMobile1' => 'required|digits:10',
            'CPWhatsApp1' => 'nullable|digits:10',
            'CPEmail1' => 'nullable|email',
            'ContactPersonName2' => 'nullable|string|max:255',
            'CPMobile2' => 'nullable|digits:10',
            'CPWhatsApp2' => 'nullable|digits:10',
            'CPEmail2' => 'nullable|email',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'ProductName' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Customer', $createdBy, $branchId, $imageName);

            $newQcId = (QuickCommerceModel::max('QuickCommerceID') ?? 0) + 1;

            QuickCommerceModel::create([
                'QuickCommerceID' => $newQcId,
                'PlatformName' => $request->DisplayName,
                'PlatformMobile' => $request->Mobile,
                'PlatformEmail' => $request->Email,
                'PlatformGSTNo' => $request->PlatformGSTNo,
                'ProductCode' => $request->ProductCode,
                'ProductPrice' => $request->ProductPrice,
                'ContactPersonName1' => $request->ContactPersonName1,
                'CPMobile1' => $request->CPMobile1,
                'CPWhatsApp1' => $request->CPWhatsApp1,
                'CPEmail1' => $request->CPEmail1,
                'ContactPersonName2' => $request->ContactPersonName2,
                'CPMobile2' => $request->CPMobile2,
                'CPWhatsApp2' => $request->CPWhatsApp2,
                'CPEmail2' => $request->CPEmail2,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'Country' => 'India',
                'PinCode' => $request->PinCode,
                'UserID' => $newUserId,
                'created_by' => $createdBy,
                'ProductName' => $request->ProductName,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);

            DB::commit();

            return response()->json([
                'message' => 'Quick Commerce User created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function employeeRelationshipManager()
    {
        return EmployeeModel::select('EmployeeName', 'DesignationID', 'EmployeeID')
            ->with(['designation:DesignationID,DesignationName'])
            ->whereHas('designation', function ($query) {
                $query->where('DesignationName', 'Relationship Manager');
            })
            ->get();
    }

    public function storeEmployee(Request $request)
    {

        $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',

            'DesignationID' => 'required|integer|exists:DesignationModels,DesignationID',
            'DateofBirth' => 'required|date|date_format:Y-m-d',
            'DateJoined' => 'required|date|date_format:Y-m-d',
            'Gender' => 'required|string|max:255',
            'Salary' => 'required|numeric',
            // 'WhatsApp' => 'required|digits:10',
            'WhatsApp' => 'nullable|digits:10',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            // 'DistributorID' => 'required|integer',
            'DistributorID' => 'nullable|integer',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Admin', $createdBy, $branchId, $imageName);

            $newEmployeeId = (EmployeeModel::max('EmployeeID') ?? 0) + 1;

            EmployeeModel::create([
                'EmployeeID' => $newEmployeeId,
                'EmployeeName' => $request->DisplayName,
                'DesignationID' => $request->DesignationID,
                'DateofBirth' => $request->DateofBirth,
                'DateJoined' => $request->DateJoined,
                'Gender' => $request->Gender,
                'Salary' => $request->Salary,
                'Mobile' => $request->Mobile,
                'WhatsApp' => $request->WhatsApp,
                'Email' => $request->Email,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'PinCode' => $request->PinCode,
                'Picture' => $request->Picture,
                'UserID' => $newUserId,
                'created_by' => $createdBy,
                'DistributorID' => $request->DistributorID ?? 0,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);

            DB::commit();

            return response()->json([
                'message' => 'Employee created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeCustomer(Request $request)
    {

        $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',

            'WhatsApp' => 'nullable|digits:10',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            // 'DistributorID' => 'required|integer|exists:DistributorModel,DistributorID',
            // 'IsUnderDistributor' => 'required|bool',
            'DistributorID' => 'nullable|integer|exists:DistributorModel,DistributorID',
            'IsUnderDistributor' => 'nullable|bool',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Customer', $createdBy, $branchId, $imageName);

            $newCustomerId = (CustomerModel::max('CustomerID') ?? 0) + 1;

            CustomerModel::create(
                [
                    'CustomerID' => $newCustomerId,
                    'CustomerName' => $request->DisplayName,
                    'Mobile' => $request->Mobile,
                    'WhatsApp' => $request->WhatsApp,
                    'Email' => $request->Email,
                    'Address' => $request->Address,
                    'Area' => $request->Area,
                    'City' => $request->City,
                    'State' => $request->State,
                    'Country' => 'India',
                    'PinCode' => $request->PinCode,
                    'UserID' => $newUserId,
                    'DistributorID' => $request->DistributorID ?? 0,
                    'IsUnderDistributor' => $request->IsUnderDistributor ?? false,
                    'created_by' => $createdBy,
                ]
            );

            $this->setDefaultAddress($request, $newUserId, $createdBy);

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

    public function storeDistributor(Request $request)
    {

        $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',


            'WhatsApp' => 'nullable|digits:10',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'PanNo' => 'required|string|max:10',
            'AdharNo' => 'required|digits:12',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Admin', $createdBy, $branchId, $imageName);

            $newDistId = (DistributorModel::max('DistributorID') ?? 0) + 1;

            DistributorModel::create([

                'DistributorID' => $newDistId,
                'DistributorName' => $request->DisplayName,
                'Mobile' => $request->Mobile,
                'WhatsApp' => $request->WhatsApp,
                'Email' => $request->Email,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'PinCode' => $request->PinCode,
                'UserID' => $newUserId,
                'created_by' => $createdBy,
                'PanNo' => $request->PanNo,
                'AdharNo' => $request->AdharNo,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);

            DB::commit();

            return response()->json([
                'message' => 'Distributor User created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeDriver(Request $request)
    {

        $request->validate([
            'DisplayName' => 'required|string|max:255',
            'Mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'Email' => 'required|email|unique:UserModels,Email',
            'Password' => 'required|string|min:6',
            'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID',


            'VehicleID' => 'required|integer|exists:VehicleModels,VehicleID',
            'Gender' => 'required|string|max:255',
            'DateofBirth' => 'required|date|date_format:Y-m-d',
            'DateJoined' => 'required|date|date_format:Y-m-d',
            'Salary' => 'required|numeric',
            'WhatsApp' => 'nullable|digits:10',
            'Address' => 'required|string',
            'Area' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'State' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
        ]);

        DB::beginTransaction();

        try {

            $authUser = auth()->user();
            $branchId = $authUser->BranchID;
            $createdBy = $authUser->UserID;
            $imageName = "No.jpg";

            $newUserId = $this->createUser($request, 'Admin', $createdBy, $branchId, $imageName);

            $newDriverId = (DriverModel::max('DriverID') ?? 0) + 1;

            DriverModel::create([
                'DriverID' => $newDriverId,
                'DriverName' => $request->DisplayName,
                'Gender' => $request->Gender,
                'DateofBirth' => $request->DateofBirth,
                'DateJoined' => $request->DateJoined,
                'Salary' => $request->Salary,
                'Mobile' => $request->Mobile,
                'WhatsApp' => $request->WhatsApp,
                'Email' => $request->Email,
                'Address' => $request->Address,
                'Area' => $request->Area,
                'City' => $request->City,
                'State' => $request->State,
                'PinCode' => $request->PinCode,
                'Picture' => $imageName,
                'UserID' => $newUserId,
                'VehicleID' => $request->VehicleID,
                'created_by' => $createdBy,
            ]);

            $this->setDefaultAddress($request, $newUserId, $createdBy);

            $this->createUserRules($request, $newUserId);

            DB::commit();

            return response()->json([
                'message' => 'Driver User created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    private function setDefaultAddress(Request $request, int $newUserId, int $createdBy)
    {

        $newDelAddId = (DeliveryAddressModel::max('DeliveryAddressID') ?? 0) + 1;

        DeliveryAddressModel::create([
            'DeliveryAddressID' => $newDelAddId,
            'AddressTitle' => 'Default',
            'DisplayName' => $request->DisplayName,
            'Mobile' => $request->Mobile,
            'WhatsApp' => $request->WhatsApp,
            'Email' => $request->Email,
            'Address' => $request->Address,
            'Area' => $request->Area,
            'City' => $request->City,
            'State' => $request->State,
            'Country' => 'India',
            'PinCode' => $request->PinCode,
            'UserID' => $newUserId,
            'IsDefault' => 'Yes',
            'created_by' => $createdBy,
        ]);
    }

    private function createUser(Request $request, string $userType, int $createdBy, int $branchId, string $imageName)
    {

        $newUserId = (UserModel::max('UserID') ?? 0) + 1;
        $hashedPassword = Hash::make($request->Password);

        UserModel::create([
            'UserID' => $newUserId,
            'DisplayName' => $request->DisplayName,
            'Mobile' => $request->Mobile,
            'Email' => $request->Email,
            'Password' => $hashedPassword,
            'UserType' => $userType,
            'Status' => 'Active',
            'Picture' => $imageName,
            'BranchID' => $branchId,
            'RoleID' => $request->RoleID,
            'created_by' => $createdBy,
        ]);

        return $newUserId;
    }

    public function showAdmin(Request $request, $userid)
    {

        $user = UserModel::with('role')->find($userid);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $admin = AdminModel::where('UserID', $userid)->first();

        if (!$admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Admin details not found.',
            ], 404);
        }

        $userData = array_merge(
            $user->toArray(),
            $admin->toArray()
        );

        return response()->json([
            'status' => 'success',
            'user' => $userData
        ], 200);
    }

    public function showInsti(Request $request, $userid)
    {

        $user = UserModel::with('role')->find($userid);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $insti = InstitutionModel::where('UserID', $userid)->first();

        if (!$insti) {
            return response()->json([
                'status' => 'error',
                'message' => 'Institution details not found.',
            ], 404);
        }

        $userData = array_merge(
            $user->toArray(),
            $insti->toArray()
        );

        return response()->json([
            'status' => 'success',
            'user' => $userData
        ], 200);
    }

    public function showQuickCommerce(Request $request, $userid)
    {

        $user = UserModel::with('role')->find($userid);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $qc = QuickCommerceModel::where('UserID', $userid)->first();

        if (!$qc) {
            return response()->json([
                'status' => 'error',
                'message' => 'Quick Commerce details not found.',
            ], 404);
        }

        $userData = array_merge(
            $user->toArray(),
            $qc->toArray()
        );


        return response()->json([
            'status' => 'success',
            'user' => $userData
        ], 200);
    }

    public function showEmployee(Request $request, $userid)
    {

        $user = UserModel::with('role')->find($userid);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $employee = EmployeeModel::where('UserID', $userid)->first();

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee details not found.',
            ], 404);
        }

        $userData = array_merge(
            $user->toArray(),
            $employee->toArray()
        );

        return response()->json([
            'status' => 'success',
            'user' => $userData
        ], 200);
    }

    public function showCustomer(Request $request, $userid)
    {

        $user = UserModel::with('role')->find($userid);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $customer = CustomerModel::where('UserID', $userid)->first();

        if (!$customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer details not found.',
            ], 404);
        }

        $userData = array_merge(
            $user->toArray(),
            $customer->toArray()
        );

        return response()->json([
            'status' => 'success',
            'user' => $userData
        ], 200);
    }

    public function showDistributor(Request $request, $userid)
    {

        $user = UserModel::with('role')->find($userid);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $distributor = DistributorModel::where('UserID', $userid)->first();

        if (!$distributor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Distributor details not found.',
            ], 404);
        }

        $userData = array_merge(
            $user->toArray(),
            $distributor->toArray()
        );

        return response()->json([
            'status' => 'success',
            'user' => $userData
        ], 200);
    }

    public function showDriver(Request $request, $userid)
    {

        $user = UserModel::with('role')->find($userid);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $driver = DriverModel::where('UserID', $userid)->first();

        if (!$driver) {
            return response()->json([
                'status' => 'error',
                'message' => 'Driver details not found.',
            ], 404);
        }

        $userData = array_merge(
            $user->toArray(),
            $driver->toArray()
        );

        return response()->json([
            'status' => 'success',
            'user' => $userData
        ], 200);
    }
    public function showInfo($id)
    {
        $user = UserModel::with('role')->find($id);
        if (!$user || !$user->role) {
            return response()->json(['RoleName' => null]);
        }
        $roleName = strtolower($user->role->RoleName);
        if ($roleName === 'admin') {
            $user->load('admin');
            $data = [
                'UserID' => $user->admin->UserID ?? null,
                'AdminID' => $user->admin->AdminID ?? null,
                'DisplayName' => $user->admin->AdminName ?? null,
                'Mobile' => $user->admin->Mobile ?? null,
                'WhatsApp' => $user->admin->WhatsApp ?? null,
                'Email' => $user->admin->Email ?? null,
                'Address' => $user->admin->Address ?? null,
                'Area' => $user->admin->Area ?? null,
                'City' => $user->admin->City ?? null,
                'State' => $user->admin->State ?? null,
                'PinCode' => $user->admin->PinCode ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } elseif ($roleName === 'customer') {
            $user->load('customer');
            $data = [
                'UserID' => $user->customer->UserID ?? null,
                'CustomerID' => $user->customer->CustomerID ?? null,
                'DisplayName' => $user->customer->CustomerName ?? null,
                'Mobile' => $user->customer->Mobile ?? null,
                'WhatsApp' => $user->customer->WhatsApp ?? null,
                'Email' => $user->customer->Email ?? null,
                'Address' => $user->customer->Address ?? null,
                'Area' => $user->customer->Area ?? null,
                'City' => $user->customer->City ?? null,
                'State' => $user->customer->State ?? null,
                'PinCode' => $user->customer->PinCode ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } elseif ($roleName === 'distributor') {
            $user->load('distributor');
            $data = [
                'UserID' => $user->distributor->UserID ?? null,
                'DistributorID' => $user->distributor->DistributorID ?? null,
                'DisplayName' => $user->distributor->DistributorName ?? null,
                'PanNo' => $user->distributor->PanNo ?? null,
                'AdharNo' => $user->distributor->AdharNo ?? null,
                'Mobile' => $user->distributor->Mobile ?? null,
                'WhatsApp' => $user->distributor->WhatsApp ?? null,
                'Email' => $user->distributor->Email ?? null,
                'Address' => $user->distributor->Address ?? null,
                'Area' => $user->distributor->Area ?? null,
                'City' => $user->distributor->City ?? null,
                'State' => $user->distributor->State ?? null,
                'PinCode' => $user->distributor->PinCode ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } elseif ($roleName === 'driver') {
            $user->load('driver');
            $data = [
                'UserID' => $user->driver->UserID ?? null,
                'DriverID' => $user->driver->DriverID ?? null,
                'DisplayName' => $user->driver->DriverName ?? null,
                'VehicleID' => $user->driver->VehicleID ?? null,
                'Gender' => $user->driver->Gender ?? null,
                'DateofBirth' => $user->driver->DateofBirth ?? null,
                'DateJoined' => $user->driver->DateJoined ?? null,
                'Salary' => $user->driver->Salary ?? null,
                'Mobile' => $user->driver->Mobile ?? null,
                'WhatsApp' => $user->driver->WhatsApp ?? null,
                'Email' => $user->driver->Email ?? null,
                'Address' => $user->driver->Address ?? null,
                'Area' => $user->driver->Area ?? null,
                'City' => $user->driver->City ?? null,
                'State' => $user->driver->State ?? null,
                'PinCode' => $user->driver->PinCode ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } elseif ($roleName === 'employee') {
            $user->load('employee');
            $data = [
                'UserID' => $user->employee->UserID ?? null,
                'EmployeeID' => $user->employee->EmployeeID ?? null,
                'DisplayName' => $user->employee->EmployeeName ?? null,
                'DesignationID' => $user->employee->DesignationID ?? null,
                'Gender' => $user->employee->Gender ?? null,
                'DateofBirth' => $user->employee->DateofBirth ?? null,
                'DateJoined' => $user->employee->DateJoined ?? null,
                'Salary' => $user->employee->Salary ?? null,
                'Mobile' => $user->employee->Mobile ?? null,
                'WhatsApp' => $user->employee->WhatsApp ?? null,
                'Email' => $user->employee->Email ?? null,
                'Address' => $user->employee->Address ?? null,
                'Area' => $user->employee->Area ?? null,
                'City' => $user->employee->City ?? null,
                'State' => $user->employee->State ?? null,
                'PinCode' => $user->employee->PinCode ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } elseif ($roleName === 'shop manager') {
            $user->load('shopmanager');
            $data = [
                'UserID' => $user->shopmanager->UserID ?? null,
                'EmployeeID' => $user->shopmanager->ShopManagerID ?? null,
                'DisplayName' => $user->shopmanager->ShopManagerName ?? null,
                'Mobile' => $user->shopmanager->Mobile ?? null,
                'WhatsApp' => $user->shopmanager->WhatsApp ?? null,
                'Email' => $user->shopmanager->Email ?? null,
                'Address' => $user->shopmanager->Address ?? null,
                'Area' => $user->shopmanager->Area ?? null,
                'City' => $user->shopmanager->City ?? null,
                'State' => $user->shopmanager->State ?? null,
                'PinCode' => $user->shopmanager->PinCode ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } elseif ($roleName === 'quick commerce') {
            $user->load('quickcommerce');
            $data = [
                'UserID' => $user->quickcommerce->UserID ?? null,
                'QuickCommerceID' => $user->quickcommerce->QuickCommerceID ?? null,
                'DisplayName' => $user->quickcommerce->PlatformName ?? null,
                'Mobile' => $user->quickcommerce->PlatformMobile ?? null,
                'Email' => $user->quickcommerce->PlatformEmail ?? null,
                'PlatformGSTNo' => $user->quickcommerce->PlatformGSTNo ?? null,
                'ProductName' => $user->quickcommerce->ProductName ?? null,
                'ProductCode' => $user->quickcommerce->ProductCode ?? null,
                'ProductPrice' => $user->quickcommerce->ProductPrice ?? null,
                'Address' => $user->quickcommerce->Address ?? null,
                'Area' => $user->quickcommerce->Area ?? null,
                'City' => $user->quickcommerce->City ?? null,
                'State' => $user->quickcommerce->State ?? null,
                'PinCode' => $user->quickcommerce->PinCode ?? null,
                'ContactPersonName1' => $user->quickcommerce->ContactPersonName1 ?? null,
                'ContactPersonName2' => $user->quickcommerce->ContactPersonName2 ?? null,
                'CPMobile1' => $user->quickcommerce->CPMobile1 ?? null,
                'CPMobile2' => $user->quickcommerce->CPMobile2 ?? null,
                'CPEmail1' => $user->quickcommerce->CPEmail1 ?? null,
                'CPEmail2' => $user->quickcommerce->CPEmail2 ?? null,
                'CPWhatsApp1' => $user->quickcommerce->CPWhatsApp1 ?? null,
                'CPWhatsApp2' => $user->quickcommerce->CPWhatsApp2 ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } elseif ($roleName === 'institution') {
            $user->load('institution', 'employee');
            $data = [
                'UserID' => $user->institution->UserID ?? null,
                'EmployeeID' => $user->institution->InstitutionID ?? null,
                'DisplayName' => $user->institution->InstitutionName ?? null,
                'GSTNo' => $user->institution->GSTNo ?? null,
                'DeliveryTime' => $user->institution->DeliveryTime ?? null,
                'Address' => $user->institution->Address ?? null,
                'InstitutionEmail' => $user->institution->InstitutionEmail ?? null,
                'OwnerName' => $user->institution->OwnerName ?? null,
                'OwnerMobile' => $user->institution->OwnerMobile ?? null,
                'Area' => $user->institution->Area ?? null,
                'City' => $user->institution->City ?? null,
                'State' => $user->institution->State ?? null,
                'PinCode' => $user->institution->PinCode ?? null,
                'ContactPersonName1' => $user->institution->ContactPersonName1 ?? null,
                'CPMobile1' => $user->institution->CPMobile1 ?? null,
                'CPWhatsApp1' => $user->institution->CPWhatsApp1 ?? null,
                'CPEmail1' => $user->institution->CPEmail1 ?? null,
                'ContactPersonName2' => $user->institution->ContactPersonName2 ?? null,
                'CPMobile2' => $user->institution->CPMobile2 ?? null,
                'CPWhatsApp2' => $user->institution->CPWhatsApp2 ?? null,
                'CPEmail2' => $user->institution->CPEmail2 ?? null,
                'BillingPercent' => $user->institution->BillingPercent ?? null,
                'PaymentMode' => $user->institution->PaymentMode ?? null,
                'PriceType' => $user->institution->PriceType ?? null,
                'EmployeeID' => $user->institution->EmployeeID ?? null,
                'RoleName' => $roleName,
                'RoleID' => $user->role->RoleID
            ];
        } else {
            $data = ['status' => 'error', 'message' => 'User not found.'];
        }
        return response()->json($data);
    }
    public function createUserRules(Request $request, $userid)
    {
        $incid = UserRulesModel::max('UserRulesID') ?? 0;
        $ruleslist = $request->rules;
        foreach ($ruleslist as $rule) {
            $incid++;
            $userRules = new UserRulesModel();
            $userRules->UserRulesID = $incid;
            $userRules->UserID = $userid;
            $userRules->RulesID = $rule;
            $userRules->save();
        }
    }
    public function showRules($id)
    {
        $rules = UserRulesModel::where('UserID', $id)->pluck('RulesID');

        return response()->json([
            'UserID' => $id,
            'rules' => $rules
        ]);
    }
    public function updateAdmin(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $admin = AdminModel::where('UserID', $id)->first();
        if (!$user || !$admin) {
            return response()->json([
                'error' => 'User or Admin not found.',
            ], 404);
        }
        AdminModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin updated successfully'
        ], 200);
    }
    public function updateShopManager(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $shopManager = ShopManagerModel::where('UserID', $id)->first();
        if (!$user || !$shopManager) {
            return response()->json([
                'error' => 'User or Shop Manager not found.',
            ], 404);
        }
        ShopManagerModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Shop Manager updated successfully'
        ], 200);
    }
    public function updateDistributor(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $distributor = DistributorModel::where('UserID', $id)->first();
        if (!$user || !$distributor) {
            return response()->json([
                'error' => 'User or Distributor not found.',
            ], 404);
        }
        DistributorModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Distributor updated successfully'
        ], 200);
    }
    public function updateCustomer(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $customer = CustomerModel::where('UserID', $id)->first();
        if (!$user || !$customer) {
            return response()->json([
                'error' => 'User or Customer not found.',
            ], 404);
        }
        CustomerModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Customer updated successfully'
        ], 200);
    }
    public function updateDriver(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'Salary' => 'required|numeric',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $driver = DriverModel::where('UserID', $id)->first();
        if (!$user || !$driver) {
            return response()->json([
                'error' => 'User or Driver not found.',
            ], 404);
        }
        DriverModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'Salary' => $request->Salary,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Driver updated successfully'
        ], 200);
    }
    public function updateEmployee(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'Salary' => 'required|numeric',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $employee = EmployeeModel::where('UserID', $id)->first();
        if (!$user || !$employee) {
            return response()->json([
                'error' => 'User or Employee not found.',
            ], 404);
        }
        EmployeeModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'Salary' => $request->Salary,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Employee updated successfully'
        ], 200);
    }
    public function updateQc(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'ContactPersonName1' => 'required|string|max:255',
            'CPMobile1' => 'required|digits:10',
            'ContactPersonName2' => 'required|string|max:255',
            'CPMobile2' => 'nullable|digits:10',
            'CPEmail1' => 'required|email',
            'CPEmail2' => 'nullable|email',
            'CPWhatsApp1' => 'nullable|digits:10',
            'CPWhatsApp2' => 'nullable|digits:10',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $qc = QuickCommerceModel::where('UserID', $id)->first();
        if (!$user || !$qc) {
            return response()->json([
                'error' => 'User or Qc not found.',
            ], 404);
        }
        QuickCommerceModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'ContactPersonName1' => $request->ContactPersonName1,
            'CPMobile1' => $request->CPMobile1,
            'ContactPersonName2' => $request->ContactPersonName2,
            'CPMobile2' => $request->CPMobile2,
            'CPEmail1' => $request->CPEmail1,
            'CPEmail2' => $request->CPEmail2,
            'CPWhatsApp1' => $request->CPWhatsApp1,
            'CPWhatsApp2' => $request->CPWhatsApp2,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Quick Commerce updated successfully'
        ], 200);
    }
    public function updateInsti(Request $request, $id)
    {
        $request->validate([
            'Area' => 'required|string|max:255',
            'PinCode' => 'required|digits:6',
            'ContactPersonName1' => 'required|string|max:255',
            'CPMobile1' => 'required|digits:10',
            'ContactPersonName2' => 'required|string|max:255',
            'CPMobile2' => 'nullable|digits:10',
            'CPEmail1' => 'required|email',
            'CPEmail2' => 'nullable|email',
            'CPWhatsApp1' => 'nullable|digits:10',
            'CPWhatsApp2' => 'nullable|digits:10',
            'RoleID' => 'required|integer|exists:RoleModels,RoleID'
        ]);
        $user = UserModel::find($id);
        $insti = InstitutionModel::where('UserID', $id)->first();
        if (!$user || !$insti) {
            return response()->json([
                'error' => 'User or Insti not found.',
            ], 404);
        }
        InstitutionModel::where('UserID', $id)->update([
            'Area' => $request->Area,
            'PinCode' => $request->PinCode,
            'ContactPersonName1' => $request->ContactPersonName1,
            'CPMobile1' => $request->CPMobile1,
            'ContactPersonName2' => $request->ContactPersonName2,
            'CPMobile2' => $request->CPMobile2,
            'CPEmail1' => $request->CPEmail1,
            'CPEmail2' => $request->CPEmail2,
            'CPWhatsApp1' => $request->CPWhatsApp1,
            'CPWhatsApp2' => $request->CPWhatsApp2,
            'updated_by' => auth()->id(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Insti updated successfully'
        ]);
    }
    public function showRelationshipManager($id)
    {
        return EmployeeModel::where('EmployeeID', $id)->first();
    }
}
