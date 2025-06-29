<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cache;

class OtpLib
{

    public static function getLoginOtp()
    {
        /**
         * Generate a 6-digit OTP for purchase.
         *
         * @return string
         */

        return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public static function getPurchaseOtp()
    {
        /**
         * Generate a 4-digit OTP .
         *
         * @return string
         */

        return str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
    }


     public static function getChangePasswordOtp()
    {
        /**
         * Generate a 6-digit OTP before changing password.
         *
         * @return string
         */

        return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public static function getRegisterOtp()
    {
        /**
         * Generate a 4-digit OTP for purchase
         * @return string
         */

        return str_pad(rand(0, 9999), 6, '0', STR_PAD_LEFT);

    }
    public static function verifyOtp(string $mobile, string $otp): bool
    {

        /**
         * Verify OTP for a given mobile number.
         *
         * @param string $mobile
         * @param string $otp
         * @return bool
         */

        $storedOtp = Cache::get('otp_' . $mobile);

        if ($storedOtp && $storedOtp === $otp) {

            Cache::forget('otp_' . $mobile);
            return true;
        }

        return false;

    }

}