<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DeliveryAddressModel;

class CustomerAddressController extends Controller
{

    public function getUserCity()
    {

        $user = auth()->user();

        $branch = $user->branch;

        return response()->json([
            'status' => 'success',
            'message' => 'user city fetched.',
            'City' => $branch->City,
            'State' => $branch->State,
        ], 200);
    }


    public function getDeliveryAddresses()
    {

        $user = auth()->user();

        $addresses = $user->deliveryAddresses()
            ->select([
                'DeliveryAddressID',
                'AddressTitle',
                'DisplayName',
                'Mobile',
                'WhatsApp',
                'Email',
                'Address',
                'Area',
                'City',
                'State',
                'Country',
                'PinCode',
                'UserID',
                'IsDefault',
            ])
            ->orderBy('AddressTitle', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Addresses fetched successfully',
            'data' => $addresses,
        ], 200);
    }

    public function deleteDeliveryAddress($id)
    {
        $user = auth()->user();

        $address = $user->deliveryAddresses()->where('DeliveryAddressID', $id)->first();

        if (!$address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Address not found or does not belong to the user.',
            ], 404);
        }

        $address->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Address deleted successfully.',
        ], 200);
    }

    public function storeAddress(Request $request)
    {
        $request->validate([
            'AddressTitle' => 'required|in:Home,Office,Other,Default',
            'DisplayName' => 'required|string|max:100',
            'Mobile' => 'required|digits:10',
            'WhatsApp' => 'nullable|digits:10',
            'Email' => 'required|email',
            'Address' => 'required|string|max:255',
            'Area' => 'required|string|max:100',
            'City' => 'required|string|max:100',
            'State' => 'required|string|max:100',
            'PinCode' => 'required|digits:6',
        ]);

        $user = auth()->user();
        $userId = $user->UserID;

        $isDefault = $request->AddressTitle === 'Default' ? 'Yes' : 'No';

        $existing = $user->deliveryAddresses()
            ->where('AddressTitle', $request->AddressTitle)
            ->first();

        $deliveryAddressId = (DeliveryAddressModel::max('DeliveryAddressID') ?? 0) + 1;

        $data = [
            'AddressTitle' => $request->AddressTitle,
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
            'IsDefault' => $isDefault,
            'UserID' => $userId,
        ];

        if ($existing) {
            $existing->update($data);
            $message = 'Address updated successfully.';
        } else {
            $data['DeliveryAddressID'] = $deliveryAddressId;
            $user->deliveryAddresses()->create($data);
            $message = 'Address added successfully.';
        }

        return response()->json([
            'status' => 'success',
            'message' => $message,
        ], 201);
    }

}
