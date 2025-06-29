<?php

namespace App\Http\Controllers;

use App\Helpers\OtpLib;
use App\Models\AreaModel;
use App\Models\BranchModel;
use App\Models\CustomerModel;
use App\Models\DeliveryAddressModel;
use App\Models\DistributorModel;
use App\Models\RoleModel;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\UserModel;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{

    public function loginWithPassword(Request $request)
    {

        $request->validate([
            'username' => [
                'required',
                function ($attribute, $value, $fail) {
                    $isEmail = filter_var($value, FILTER_VALIDATE_EMAIL);
                    $isPhone = preg_match('/^\d{10}$/', $value);

                    if (!$isEmail && !$isPhone) {
                        $fail('The username must be a valid email or a 10-digit phone number.');
                    }
                }
            ],
            'password' => ['required', 'string', 'min:4'],
        ]);

        $user = UserModel::with('role')
            ->where('Email', $request->username)
            ->orWhere('Mobile', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->Password)) {
            return response()->json(['message' => 'Invalid Credentials'], 401);
        }

        $token = auth()->login($user);

        $redirectUrl = "/";
        $userType = $user->UserType;

        if ($userType !== "Customer") {
            $redirectUrl = "/Dashboard";
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
            'status' => 'success',
            'message' => "Logged in successfully.",
            'redirect_url' => $redirectUrl,
        ]);

    }

    public function loginWithOtp(Request $request)
    {

        $request->validate([
            'mobile' => 'required|digits:10',
            'otpcode' => 'required|digits:6',
        ]);

        $mobile = $request->mobile;
        $userOtp = $request->otpcode;

        if (!OtpLib::verifyOtp($mobile, $userOtp)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired OTP.',
            ], 401);
        }

        $user = UserModel::with('role')->where('Mobile', $mobile)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found!'
            ], 404);
        }

        $token = auth()->login($user);

        $redirectUrl = "/";
        $userType = $user->UserType;

        if ($userType !== "Customer") {
            $redirectUrl = "/Dashboard";
        }


        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
            'status' => 'success',
            'message' => "Logged in successfully.",
            'redirect_url' => $redirectUrl,
        ]);

    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::parseToken()->invalidate();
            return response()->json(['status' => 'success', 'message' => 'Logged out successfully.'], 200);
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token already expired.'], 200);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token is invalid.'], 200);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token not found.', 200]);
        }
    }

    public function refresh()
    {

        return $this->respondWithToken(auth()->refresh());
    }

    public function registerUser(Request $request)
    {

        $regDetails = $request->all();

        $regDetails = $request->validate([
            'fname' => 'required|string|max:50|regex:/^[a-zA-Z\s\'\-\p{L}]+$/u',
            'lname' => 'required|string|max:50|regex:/^[a-zA-Z\s\'\-\p{L}]+$/u',
            'mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'email' => 'required|email|unique:UserModels,Email',
            'password' => 'required|string|min:6|max:30',
            'branchid' => 'required|string|exists:BranchModels,BranchID',
            'areaid' => 'nullable|integer',
            'referralcode' => 'nullable|digits:10',
        ]);

        DB::beginTransaction();

        try {
            $fname = $regDetails['fname'];
            $lname = $regDetails['lname'];
            $mobile = $regDetails['mobile'];
            $email = $regDetails['email'];
            $password = $regDetails['password'];
            $branchid = $regDetails['branchid'];
            $referralcode = $regDetails['referralcode'];
            $areaid = $regDetails['areaid'];

            $displayname = $fname . " " . $lname;
            $referralcode = (string) $referralcode;
            $imageName = "No.jpg";

            $distributor = DistributorModel::where('Mobile', $referralcode)->first();
            $branch = BranchModel::find($branchid);
            $city = $branch->City;
            $state = $branch->State;

            $area = AreaModel::find($areaid);
            $areaName = $area ? $area->AreaName : '';
            $areaPin = $area ? $area->PinCode : '';

            // user creation
            $newUserId = (UserModel::max('UserID') ?? 0) + 1;
            $hashedPassword = Hash::make($password);

            $role = RoleModel::where('RoleName', 'Customer')->first();

            if (!$role) {
                throw new \Exception("Role 'Customer' not found.");
            }

            $roleid = $role->RoleID;

            $newUser = new UserModel([
                'UserID' => $newUserId,
                'DisplayName' => $displayname,
                'Mobile' => $mobile,
                'Email' => $email,
                'Password' => $hashedPassword,
                'UserType' => 'Customer',
                'Status' => 'Active',
                'Picture' => $imageName,
                'BranchID' => $branchid,
                'RoleID' => $roleid,
            ]);

            $newUser->save();

            // customer creation
            $custid = (CustomerModel::max('CustomerID') ?? 0) + 1;

            $newUser->customer()->create([
                'CustomerID' => $custid,
                'CustomerName' => $displayname,
                'Mobile' => $mobile,
                'WhatsApp' => $mobile,
                'Email' => $email,
                'Address' => "",
                'Area' => $areaName,
                'City' => $city,
                'State' => $state,
                'Country' => 'India',
                'PinCode' => $areaPin,
                'IsUnderDistributor' => $distributor ? true : false,
                'DistributorID' => $distributor ? $distributor->DistributorID : 0,
            ]);

            // set default address
            $delid = (DeliveryAddressModel::max('DeliveryAddressID') ?? 0) + 1;

            $newUser->deliveryAddresses()->create([
                'DeliveryAddressID' => $delid,
                'AddressTitle' => "Default",
                'DisplayName' => $displayname,
                'Mobile' => $mobile,
                'WhatsApp' => $mobile,
                'Email' => $email,
                'Address' => "",
                'Area' => $areaName,
                'City' => $city,
                'State' => $state,
                'Country' => 'India',
                'PinCode' => $areaPin,
                'IsDefault' => 'Yes',
            ]);

            $token = auth()->login($newUser);

            $redirectUrl = "/";

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully.',
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'redirect_url' => $redirectUrl,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'User registration failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function user(Request $request)
    {
        $user = auth()->user();

        $branch = $user->branch()
            ->select([
                'BranchID',
                'BranchName',
                'City',
                'State',
            ])
            ->get();

        $role = $user->role()
            ->select([
                'RoleID',
                'RoleName',
            ])
            ->get();

        return response()->json([
            'name' => $user->DisplayName,
            'mobile' => $user->Mobile,
            'email' => $user->Email,
            'usertype' => $user->UserType,
            'picture' => $user->Picture,
            'branch' => $branch,
            'role' => $role,
        ], 200);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }

    public function verifyRegistrationEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $email = $validated['email'];

        $emailExists = UserModel::where('Email', $email)->exists();

        if ($emailExists) {
            return response()->json([
                'status' => 'error',
                'message' => 'This email id is already registered with us.',
            ], 409);
        }

        return response()->json([
            'status' => 'success',
        ], 200);
    }

    public function getUserRole() {

        $user = auth()->user();

        if(!$user){
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated user.'
            ], 401);
        }

        $role = $user->role()->select('RoleID', 'RoleName')->get();

        return response()->json([
            'status' => 'success',
            'role' => $role
        ]);
    }

}

