<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\UserRecoveryModel;
use App\Models\BranchModel;
use App\Models\EmployeeModel;
use App\Models\DesignationModel;
use App\Models\CustomerModel;
use App\Models\DeliveryAddressModel;
use App\Models\DistributorModel;
use App\Models\OrderModel;
// use App\Lib\TextLib;
// use App\Lib\TextSms;
// use Pest\ArchPresets\Custom;

class VerifyApiController extends Controller
{
    // for check duplicate mobile
    public function DuplicateMobile(Request $request)
    {
        $mobile = $request->input('mobile');
        $res = UserModel::where('Mobile', $mobile)->exists();
        if ($res) {
            return response()->json([
                'result' => 'Y',
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }
    // for check duplicate email
    public function DuplicateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email', //Ensures a valid email is provided
        ]);

        $email = $request->input('email');
        $res = UserModel::where('Email', $email)->exists();
        if ($res) {
            return response()->json([
                'result' => 'Y',
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }
    public function VerifyMobileSendOtp(Request $request)
    {
        $mobile = $request->input('mobile');
        $res = UserModel::where('Mobile', $mobile)
            ->select('UserID')
            ->first();

        if ($res) {
            $gencode = TextLib::GetOTPCode();
            $response = Http::post('https://control.msg91.com/api/v5/otp', [
                'mobile' => '91' . $mobile,
                'otp_expiry' => '10',
                'template_id' => '677fb791d6fc053400768732',
                'authkey' => '437798Ajz9pV8W6778d5b2P1',
                'realTimeResponse' => '1',
                'OTP' => $gencode,
            ]);
            //  dd($response);
            if ($response->successful()) {
                Cookie::queue('systemotpcode', $gencode, 10);
                $uid = Crypt::encryptString($res->UserID);
                return response()->json([
                    'result' => 'Y',
                    'uid' => $uid,
                ]);
            } else {
                return response()->json([
                    'result' => 'N',
                ], 500);
            }
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }


    public function sendOrderConfirmationSms(Request $request)
    {
        $cDetails = $request->validate(
            [
                'orderid' => 'required|integer',
                'uid' => 'required',
            ]
        );

        $userid = Crypt::decryptString($cDetails['uid']);
        $orderid = $cDetails['orderid'];

        $customerDetails = UserModel::where("UserID", '=', $userid)
            ->select('DisplayName', 'Mobile', 'Email')
            ->first();

        $name = $customerDetails->DisplayName;
        $mobile = $customerDetails->Mobile;
        $email = $customerDetails->Email;

        $amount = OrderModel::where("OrderID", '=', $orderid)
            ->where('ClientID', '=', $userid)
            ->value('TotalAmount');

        $data = [
            'template_id' => '6799bec9d6fc05323164d322',
            'short_url' => '0',
            'realTimeResponse' => '1',
            'recipients' => [
                [
                    "mobiles" => "91" . $mobile,
                    "customer_name" => $name,
                    "order_no" => $orderid,
                    "amount" => $amount,
                ]

            ]
        ];

        $response = Http::withHeaders(
            [
                'authkey' => '437798Ajz9pV8W6778d5b2P1',
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ]
        )->post(
                'https://control.msg91.com/api/v5/flow',
                $data

            );

        if ($response->successful()) {

            return response()->json(['result' => 'Y']);
        } else {
            return response()->json(['result' => 'N']);
        }
    }

    public function SendEmailOtp(Request $request)
    {

        $request->validate([
            'username' => 'required|email',
        ]);

        $user = $request->input('username');

        $emailvalid = UserModel::where('Email', '=', $user)->exists();

        if ($emailvalid) {

            $data = [
                "recipients" => [
                    [
                        "to" => [
                            [
                                "name" => "Rohit Nautiyal",
                                "email" => $user  
                            ]      
                        ],
                        "variables" => [
                            "otp" => "301019"
                        ]   
                    ]
                  
                ],

                "from" => [
                    "name" => "Gharaya",    
                    "email" => "alerts@mail.gharaya.com"
                ],

                "domain" => "mail.gharaya.com",

                "template_id" => "otp_verification_7",
            ];
        };

        $response = Http::withHeaders([
            'accept' => 'application/json',
            'authkey' => '437798Ajz9pV8W6778d5b2P1',
            'content-type' => 'application/JSON',
        ])->post('https://control.msg91.com/api/v5/email/send', $data);

        if($response->successful()){
          echo "response ok";
        }


    }


    public function RegitrationSendOtp(Request $request)
    {
        $request->validate([
            'mobile' => 'required|digits:10',  // Ensures mobile number contains exactly 10 digits
        ]);

        // getOtpCode
        $mobile = $request->input('mobile');
        $res = UserModel::where('Mobile', $mobile)->exists();
        if ($res) {
            // if the mobile number is already registered then return No 'N'
            return response()->json([
                'result' => 'N',
            ]);
        } else {

            // if the mobile number is not registered then return Yes 'Y' and generate otp
            $gencode = TextLib::GetOTPCode();
            $response = Http::post('https://control.msg91.com/api/v5/otp', [
                'mobile' => '91' . $mobile,
                'otp_expiry' => '10',
                'template_id' => '677fb791d6fc053400768732',
                'authkey' => '437798Ajz9pV8W6778d5b2P1',
                'realTimeResponse' => '1',
                'OTP' => $gencode,
            ]);

            if ($response->successful()) {
                Cookie::queue('systemotpcode', $gencode, 10);
                return response()->json([
                    'result' => 'Y',
                ]);
            } else {
                return response()->json([
                    'result' => 'N',
                ], 500);
            }
        }
    }


    // determine user type
    public function VerifyUser(Request $request)
    {
        $user = $request->input('user');
        $mob = UserModel::where('Mobile', $user)->exists();
        $email = UserModel::where('Email', $user)->exists();

        if ($mob) {
            return response()->json([
                'result' => 'Y',
                'mode' => 'mymobile'
            ]);
        } else if ($email) {
            return response()->json([
                'result' => 'Y',
                'mode' => 'email'
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }

    public function LoginwithMobile(Request $request)
    {
        $mobile = $request->input('mobile');
        $systemotp = Cookie::get('systemotpcode');
        $userotp = $request->input('otpcode');

        if ($systemotp != $userotp) {
            return response()->json([
                'result' => 'N',
            ]);
        } else {
            $user = UserModel::where('Mobile', $mobile)->first();
            $usertype = $user->UserType;
            $branchname = "";
            $designationName = "";
            if ($usertype != "Super") {
                $branch = BranchModel::where('BranchID', $user->BranchID)->first();
                $branchname = $branch->BranchName;
            }
            if ($usertype == "Employee") {
                $emp = EmployeeModel::where('UserID', $user->UserID)->first();
                $designation = DesignationModel::where('DesignationID', $emp->DesignationID)->first();
                $designationName = $designation->DesignationName;
            }
            if ($usertype == "Distributor") {
                $dis = DistributorModel::where('UserID', $user->UserID)->first();
                Cookie::queue('distributorid', $dis->DistributorID, 3600);
            }
            $bid = Crypt::encryptString($user->BranchID);
            $uid = Crypt::encryptString($user->UserID);

            cookie::queue('userid', $user->UserID, 3600);
            cookie::queue('loginstatus', 'yes', 3600);
            cookie::queue('branchid', $user->BranchID, 3600);
            cookie::queue('usertype', $usertype, 3600);
            cookie::queue('picture', $user->Picture, 3600);
            cookie::queue('displayname', $user->DisplayName, 3600);

            return response()->json([
                'result' => 'Y',
                'displayname' => $user->DisplayName,
                'branchname' => $branchname,
                'usertype' => $usertype,
                'designationName' => $designationName,
                'branchid' => $bid,
                'userid' => $uid
            ]);
        }
    }
    public function LoginwithPassword(Request $request)
    {

        $request->validate([
            'user' => 'required|string',
            'password' => 'required|string|min:4|max:30', //Password must be atleast 6 and max 30 characters long
        ]);

        $password = $request->input('password');
        $email = $request->input('user');
        $mobile = $request->input('user');
        $user = UserModel::where('Email', $email)->first();
        $designationName = "";
        $branchname = "";

        if ($user == null) {
            $user = UserModel::where('Mobile', $mobile)->first();
        }
        if ($user && Hash::check($password, $user->Password)) {

            $usertype = $user->UserType;
            if ($usertype != "Super") {
                $branch = BranchModel::where('BranchID', $user->BranchID)->first();
                $branchname = $branch->BranchName;
            }
            if ($usertype == "Employee") {
                $emp = EmployeeModel::where('UserID', $user->UserID)->first();
                $designation = DesignationModel::where('DesignationID', $emp->DesignationID)->first();
                $designationName = $designation->DesignationName;
            }
            if ($usertype == "Distributor") {
                $dis = DistributorModel::where('UserID', $user->UserID)->first();
                Cookie::queue('distributorid', $dis->DistributorID, 3600);
            }

            $bid = Crypt::encryptString($user->BranchID);
            $uid = Crypt::encryptString($user->UserID);
            cookie::queue('userid', $user->UserID, 3600);
            cookie::queue('loginstatus', 'yes', 3600); // logic here
            cookie::queue('branchid', $user->BranchID, 3600);
            cookie::queue('usertype', $usertype, 3600);
            cookie::queue('picture', $user->Picture, 3600);
            cookie::queue('displayname', $user->DisplayName, 3600);
            
          
            return response()->json([
                'result' => 'Y',
                'displayname' => $user->DisplayName,
                'branchname' => $branchname,
                'usertype' => $usertype,
                'designationName' => $designationName,
                'branchid' => $bid,
                'userid' => $uid
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }
    // login with mobile / user    
    public function GetLoginChallange(Request $request)
    {
        $loginMode = $request->input('loginMode');
        $mobile = $request->input('mobile');

        if ($loginMode == 'mobile') {
            $systemotp = Cookie::get('systemotpcode');
            $userotp = $request->input('otpcode');

            if ($systemotp != $userotp) {
                return response()->json([
                    'result' => 'N',
                ]);
            } else {
                $user = UserModel::where('Mobile', $mobile)->first();

                $usertype = $user->UserType;
                $branchname = "";
                if ($usertype != "Super") {
                    $branch = BranchModel::where('BranchID', $user->BranchID)->first();
                    $branchname = $branch->BranchName;
                }

                $bid = Crypt::encryptString($user->BranchID);
                $uid = Crypt::encryptString($user->UserID);
                cookie::queue('loginstatus', 'yes', 3600);
                cookie::queue('branchid', $user->BranchID, 3600);

                return response()->json([
                    'result' => 'Y',
                    'displayname' => $user->DisplayName,
                    'branchname' => $branchname,
                    'usertype' => $usertype,
                    'branchid' => $bid,
                    'userid' => $uid
                ]);
            }
        } else // here email and mobile 
        {
            $password = $request->input('password');
            $email = $request->input('user');
            $mobile2 = $request->input('user');



            if ($loginMode == 'email') {
                $user = UserModel::where('Email', $email)->first();
            } else {
                $user = UserModel::where('Mobile', $mobile2)->first();
            }


            if ($user && Hash::check($password, $user->Password)) {

                $usertype = $user->UserType;
                $branchname = "";
                if ($usertype != "Super") {
                    $branch = BranchModel::where('BranchID', $user->BranchID)->first();
                    $branchname = $branch->BranchName;
                }

                $bid = Crypt::encryptString($user->BranchID);
                $uid = Crypt::encryptString($user->UserID);
                cookie::queue('loginstatus', 'yes', 3600); // logic here
                cookie::queue('branchid', $user->BranchID, 3600);


                return response()->json([
                    'result' => 'Y',
                    'displayname' => $user->DisplayName,
                    'branchname' => $branchname,
                    'usertype' => $usertype,
                    'branchid' => $bid,
                    'userid' => $uid
                ]);

            } else {
                return response()->json([
                    'result' => 'N',

                ]);
            }
        }
    }
    // registered user
    public function RegisterUser(Request $request)
    {

         $regDetails = $request->all();  // This will get all the data as an array

        $regDetails = $request->validate([
            'fname' => 'required|string|max:50|regex:/^[a-zA-Z\s\'\-\p{L}]+$/u',
            'lname' => 'required|string|max:50|regex:/^[a-zA-Z\s\'\-\p{L}]+$/u',
            'mobile' => 'required|digits:10|unique:UserModels,Mobile',
            'email' => 'required|email|unique:UserModels,Email',
            'password' => 'required|string|min:6|max:30',
            'branchid' => 'required|string',
            'referralcode' => 'required|digits:10',
        ]);


        // Alternatively, you can access individual fields directly
        $fname = $regDetails['fname'];
        $lname = $regDetails['lname'];
        $mobile = $regDetails['mobile'];
        $email = $regDetails['email'];
        $password = $regDetails['password'];
        $branchid = $regDetails['branchid'];
        $referralcode = $regDetails['referralcode'];

        $referralcode = trim($referralcode);
        $referralcode = (string) $referralcode;

        $distibuterid = 0;
        $underdistributer = false;

        try {
            $dis = DistributorModel::where('Mobile', $referralcode)->first();

            if ($dis) {
                $distibuterid = $dis->DistributorID;
                $underdistributer = true;
            }
        } catch (\Exception $e) {
            // Handle the exception
        }


       $branchid = $request->input('branchid');
        // $branchid = Crypt::decryptString($bid);

        $usertype = "Customer";
        $displayname = $fname . " " . $lname;

        // get city and state from branch 
        $branch = BranchModel::where('BranchID', $branchid)->first();
        $city = $branch->City;
        $state = $branch->State;
        $country = $branch->Country;

        // user creation
        $imageName = "No.jpg";
        $incid = UserModel::max('UserID') ?? 0;
        $newUserID = $incid + 1;
        $hashedPassword = Hash::make($password);

        UserModel::create([
            'UserID' => $newUserID,
            'DisplayName' => $displayname,
            'Mobile' => $mobile,
            'Email' => $email,
            'Password' => $hashedPassword,
            'UserType' => $usertype,
            'Status' => "Active",
            'Picture' => $imageName,
            'BranchID' => $branchid,
        ]);
        // customer creation
        $cusid = CustomerModel::max('CustomerID') ?? 0;
        $cusid = $cusid + 1;
        CustomerModel::create([
            'CustomerID' => $cusid,
            'CustomerName' => $displayname,
            'Mobile' => $mobile,
            'WhatsApp' => $mobile,
            'Email' => $email,
            'Address' => "",
            'Area' => "",
            'City' => $city,
            'State' => $state,
            'Country' => $country,
            'PinCode' => "",
            'UserID' => $newUserID,
            'IsUnderDistributor' => $underdistributer,
            'DistributorID' => $distibuterid,

        ]);

        // set default address
        $delid = DeliveryAddressModel::max('DeliveryAddressID') ?? 0;
        $delid = $delid + 1;
        DeliveryAddressModel::create([
            'DeliveryAddressID' => $delid,
            'AddressTitle' => "Default",
            'DisplayName' => $displayname,
            'Mobile' => $mobile,
            'WhatsApp' => $mobile,
            'Email' => $email,
            'Address' => "",
            'Area' => "",
            'City' => $city,
            'State' => $state,
            'Country' => $country,
            'PinCode' => "",
            'UserID' => $newUserID,
            'IsDefault' => "Yes",
        ]);

        return response()->json([
            'result' => 'Y',
        ]);
    }
    function IsLogin(Request $request)
    {
        $islogin = Cookie::get('islogin');
        if ($islogin == "yes") {
            return response()->json([
                'result' => 'Y',
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }

    }
    public function verifyOtpCode(Request $request)
    {

        $request->validate([
            'otpcode' => 'required|digits:6', // Ensuring 'otpcode' is exactly 6 digits
        ]);

        $otpcode = $request->input('otpcode');
        $systemotp = Cookie::get('systemotpcode');

        if ($systemotp == $otpcode) {
            return response()->json([
                'result' => 'Y',
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }

    }

    public function changePassword(Request $request)
    {   
        $request->validate([
            'userid' => 'required',
            'newPassword' => 'required|string|min:6',
        ]);

        $userid = $request->input('userid');
        $userid = Crypt::decryptString($userid);
        $newPassword = $request->input('newPassword');
        
        $user = UserModel::where('UserID', $userid)->first();
        if ($user) {
            $user->Password = Hash::make($newPassword);
            $user->save();
            return response()->json([
                'result' => 'Y',
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }

    function GetCustomerAccountDetails(Request $request)
    {
        $userid = $request->input('uid');
        $userid = Crypt::decryptString($userid);
        $user = UserModel::where('UserID', $userid)->first();
        if ($user) {
            // displayname contains "FirstName LastName"
            $nameParts = explode(' ', $user->DisplayName, 2);

            // Handle cases where only one name is provided
            $firstname = $nameParts[0] ?? ''; // First part of the name
            $lastname = $nameParts[1] ?? '';  // Second part of the name, if available   
            return response()->json([
                'result' => 'Y',
                'firstname' => $firstname,
                'lastname' => $lastname,
                'email' => $user->Email,
                'mobile' => $user->Mobile,
                // 'whatsapp' => $user->WhatsApp,
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }
    function Logout(Request $request)
    {
        Cookie::queue(Cookie::forget('loginstatus', '/', 'null', false));   
        Cookie::queue(Cookie::forget('branchid', '/', null, false));
        Cookie::queue(Cookie::forget('usertype', '/', null, false));

        return response()->json([
            'result' => 'Yes',
        ]);
    }

    public function GetUserType(Request $request)
    {
        $request->validate([
            'uid' => 'required'
        ]);


        $uid = $request->input('uid');
        $userid = Crypt::decryptString($uid);

        $UserDetails = UserModel::where('UserID', '=', $userid)->first();
        $usertype = $UserDetails->UserType;
        $designationName = "";

        if($usertype == "Employee") {
            
            $emp = EmployeeModel::where('UserID', '=', $userid)->first();
            $designation = DesignationModel::where('DesignationID', '=', $emp->DesignationID)->first();
            $designationName = $designation->DesignationName;
        }

        $responseData = [
            'result' => 'Y',
            'usertype' => $usertype,
            'designation' => $designationName,
        ];

        $encodedReponse = base64_encode(json_encode($responseData));

        return response()->json(['data' => $encodedReponse]);
       
    }
    public function DelUserInfo(Request $request)
    {
        $userid = $request->input('uid');
        $userid = Crypt::decryptString($userid);      
        $user = UserModel::where('UserID', $userid)->first();      
       
        if ($user) {
            $userRecovery = new UserRecoveryModel();             
            foreach ($user->getAttributes() as $key => $value) {             
                if ($key != 'UserID') {
                    $userRecovery->$key = $value;
                }
            }    
            $userRecovery->UserID = $userid; 
            $userRecovery->save();           
            UserModel::where('UserID', $userid)->delete();            
            return response()->json([   
                'result' => 'Y',
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }

    public function SandPurchaseOTP( Request $request)
    {
      $gencode = TextLib::GetVenderOTPCode();
      $mobile = $request->input('mobile');
      $vendor = $request->input('vender');
      $item = $request->input('item');

      $chunks = explode('/-', $item);
      $filteredChunks = array_filter($chunks);
      
      foreach ($filteredChunks as $chunk) {
          $item = $chunk;
          $data = [
              'template_id' => '68034bc8d6fc0523e552b2c3',
              'short_url' => '0',
              'realTimeResponse' => '1',
              'recipients' => [
                  [
                      "mobiles" => "91" . $mobile,
                      "otp" => $gencode,
                      "item" => $item,
                      "vendor" => $vendor,
                  ]
              ]
          ];

          // 

          $response = Http::withHeaders(
            [
                'authkey' => '437798Ajz9pV8W6778d5b2P1',
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ]
            )->post(
                'https://control.msg91.com/api/v5/flow',
                $data

            );
        }


        if ($response->successful()) {
            Cookie::queue('purchasecode', $gencode, 300);
            return response()->json(['result' => 'Y']);
        } else {
            return response()->json(['result' => 'N']);
        } 
    }
    public function VerifyPurchaseOTP(Request $request)
    {
        $request->validate([
            'otpcode' => 'required|digits:4', // Ensuring 'otpcode' is exactly 6 digits
        ]);
        $otpcode = $request->input('otpcode');       
        $purchasecode = Cookie::get('purchasecode');  
        if ($purchasecode == $otpcode) {
            return response()->json([
                'result' => 'Y',
            ]);
        } else {
            return response()->json([
                'result' => 'N',
            ]);
        }
    }   

}
