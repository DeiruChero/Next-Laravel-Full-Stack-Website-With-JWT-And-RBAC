<?php

namespace App\Http\Controllers;

use App\Helpers\OtpLib;
use App\Models\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class OtpController extends Controller
{
    public function sendLoginOtp(Request $request)
    {

        $request->validate([
            'mobile' => 'required|digits:10',
        ]);

        $mobile = $request->mobile;
        $user = UserModel::where('Mobile', $mobile)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found! Please check the mobile number.',
            ], 404);
        }

        $otp = OtpLib::getLoginOtp();

        Cache::put('otp_' . $mobile, $otp, now()->addMinutes(10));

        $response = Http::post('https://control.msg91.com/api/v5/otp', [
            'mobile' => '91' . $mobile,
            'otp_expiry' => '10',
            'template_id' => env('MSG91_SENDOTP'),
            'authkey' => env('MSG91_AUTHKEY'),
            'realTimeResponse' => '1',
            'OTP' => $otp,
        ]);

        if (!$response->successful()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send OTP. Please try again.'
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'OTP sent successfully',
        ], 200);
    }

    public function sendRegistrationOtp(Request $request)
    {

        $request->validate([
            'mobile' => 'required|digits:10',
        ]);

        $mobile = $request->mobile;
        $user = UserModel::where('Mobile', $mobile)->first();

        if ($user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User already exists with the given mobile number.',
            ], 404);
        }

        $otp = OtpLib::getRegisterOtp();

        Cache::put('otp_' . $mobile, $otp, now()->addMinutes(10));

        $response = Http::post('https://control.msg91.com/api/v5/otp', [
            'mobile' => '91' . $mobile,
            'otp_expiry' => '10',
            'template_id' => env('MSG91_SENDOTP'),
            'authkey' => env('MSG91_AUTHKEY'),
            'realTimeResponse' => '1',
            'OTP' => $otp,
        ]);

        if (!$response->successful()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send OTP. Please try again.'
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'OTP sent successfully',
        ], 200);
    }

    public function verifyRegistrationOtp(Request $request)
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

         $user = UserModel::where('Mobile', $mobile)->first();

        if ($user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User already exists with given mobile number.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'OTP verifed successfully',
        ], 201);

    }

     public function sendChangePassOtp(Request $request)
    {

        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found!',
            ], 404);
        }

        $mobile = $user->Mobile;
        $otp = OtpLib::getChangePasswordOtp();

        Cache::put('otp_' . $mobile, $otp, now()->addMinutes(10));

        $response = Http::post('https://control.msg91.com/api/v5/otp', [
            'mobile' => '91' . $mobile,
            'otp_expiry' => '10',
            'template_id' => env('MSG91_SENDOTP'),
            'authkey' => env('MSG91_AUTHKEY'),
            'realTimeResponse' => '1',
            'OTP' => $otp,
        ]);

        if (!$response->successful()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send OTP. Please try again.'
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'OTP sent successfully',
        ], 200);
    }

    public function verifyChangePassOtp(Request $request){

        $request->validate([
            'otpcode' => 'required|digits:6',
        ]);

        $user = auth()->user();

          if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found!',
            ], 404);
        }

        $mobile = $user->Mobile;
        $userOtp = $request->otpcode;

        if (!OtpLib::verifyOtp($mobile, $userOtp)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired OTP.',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'OTP verifed successfully',
        ], 201);
        
    }

}
