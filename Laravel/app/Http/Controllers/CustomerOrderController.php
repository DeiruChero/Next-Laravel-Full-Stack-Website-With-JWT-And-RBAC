<?php

namespace App\Http\Controllers;

use App\Models\BranchPriceModel;
use App\Models\OrderModel;
use App\Models\OrderTransModel;
use App\Models\UserModel;
use Http;
use Illuminate\Http\Client\ResponseSequence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\InstitutionModel;
use App\Models\OrderAsignModel;
use Carbon\Carbon;

class CustomerOrderController extends Controller
{
    public function getCustomerOrdersList(Request $request)
    {

        $user = auth()->user();

        $perPage = $request->input('limit', 10);

        $ordersList = $user->orderList()
            ->select([
                'OrderID',
                'OrderNo',
                'OrderDate',
                'OrderStatus',
                'AddressTitle',
                'PaymentMode',
                'PaymentStatus',
                'SubTotal',
                'DeliveryCharges',
                'TotalAmount',
                'DeliveredDate',
            ])
            ->orderBy('OrderID', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Order List fetched successfully.',
            'ordersList' => $ordersList->items(),
            'total' => $ordersList->total(),
            'perPage' => $ordersList->perPage(),
            'currentPage' => $ordersList->currentPage(),
        ], 200);
    }

    public function getCustomerOrderData(Request $request, $orderid)
    {

        $user = auth()->user();

        $orderData = $user->orderList()
            ->select([
                'OrderID',
                'OrderNo',
                'OrderDate',
                'OrderStatus',
                'AddressTitle',
                'PaymentMode',
                'PaymentStatus',
                'SubTotal',
                'DeliveryCharges',
                'TotalAmount',
                'DeliveredDate',
            ])
            ->where('OrderID', $orderid)
            ->with([
                'orderDetails' => function ($query) {
                    $query->select([
                        'OrderTransID',
                        'ProductID',
                        'Quantity',
                        'Rate',
                        'Amount',
                        'OrderID',
                    ]);
                }
            ])
            ->with([
                'orderDetails' => function ($q) {
                    $q->select([
                        'OrderTransID',
                        'ProductID',
                        'Quantity',
                        'Rate',
                        'Amount',
                        'OrderID',
                    ]);
                },
                'orderDetails.product' => function ($q) {
                    $q->select([
                        'ProductID',
                        'ProductName',
                        'ProductUnicodeName',
                        'UnitID',
                        'PackSizeID',
                        'CategoryID',
                        'Picture',
                    ]);
                },
                'orderDetails.product.unit' => function ($q) {
                    $q->select([
                        'UnitID',
                        'UnitName',
                    ]);
                },
                'orderDetails.product.packsize' => function ($q) {
                    $q->select([
                        'PackSizeID',
                        'Facter',
                    ]);
                }
            ])
            ->first();

        if (!$orderData) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Order details fetched successfully.',
            'orderData' => $orderData
        ], 200);
    }

    public function index()
    {
        $customerList = UserModel::where('UserType', 'Customer')
            ->select([
                'UserID',
                'DisplayName',
                'UserType',
            ])
            ->get();
        return response()->json($customerList);
    }

    public function orderCancelData(Request $request)
    {
        $query = OrderModel::whereNotIn('OrderStatus', ['Delivered', 'Cancelled'])
            ->whereHas('client.role', function ($query) {
                $query->where('RoleName', 'Customer');
            })
            ->with('client');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('OrderNo', 'like', "%$search%")
                    ->orWhere('PaymentMode', 'like', "%$search%")
                    ->orWhere('OrderStatus', 'like', "%$search%");
            });
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

        $orders = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get([
                'OrderID',
                'OrderNo',
                'OrderDate',
                'OrderStatus',
                'OrderMode',
                'PaymentMode',
                'PaymentStatus',
                'ClientID'
            ]);

        $formatted = $orders->map(function ($order) {
            return [
                'OrderID' => $order->OrderID,
                'OrderNo' => $order->OrderNo,
                'OrderDate' => $order->OrderDate,
                'OrderStatus' => $order->OrderStatus,
                'OrderMode' => $order->OrderMode,
                'PaymentMode' => $order->PaymentMode,
                'PaymentStatus' => $order->PaymentStatus,
                'DisplayName' => $order->client->DisplayName ?? '',
            ];
        });

        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ]);
    }
    public function orderCancelShow($id)
    {
        $order = OrderModel::with(['client.role', 'customer.distributor'])->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $items = OrderTransModel::with('product.unit')
            ->where('OrderID', $order->OrderID)
            ->select('OrderID', 'OrderTransID', 'ProductID', 'Quantity', 'Rate', 'Amount')
            ->get()
            ->map(function ($item) {
                return [
                    'OrderID' => $item->OrderID,
                    'OrderTransID' => $item->OrderTransID,
                    'ProductID' => $item->ProductID,
                    'ProductName' => $item->product->ProductName ?? '',
                    'UnitName' => $item->product->unit->UnitName ?? '',
                    'Quantity' => $item->Quantity,
                    'Rate' => $item->Rate,
                    'Amount' => $item->Amount
                ];
            });

        $customer = $order->customer;

        return response()->json([
            'OrderID' => $order->OrderID,
            'ClientID' => $order->ClientID,
            'OrderNo' => $order->OrderNo,
            'OrderDate' => $order->OrderDate,
            'DisplayName' => $order->client->DisplayName ?? '',
            'Remark' => $order->Remark,
            'TotalAmount' => $order->TotalAmount,
            'AddressTitle' => $order->AddressTitle,
            'PaymentMode' => $order->PaymentMode,
            'PaymentStatus' => $order->PaymentStatus,
            'OrderMode' => $order->OrderMode,
            'OrderStatus' => $order->OrderStatus,
            'UserType' => $order->client->role->RoleName ?? '',
            'items' => $items,

            'CustomerName' => $customer->CustomerName ?? '',
            'Mobile' => $customer->Mobile ?? '',
            'WhatsApp' => $customer->WhatsApp ?? '',
            'Email' => $customer->Email ?? '',
            'Address' => $customer->Address ?? '',
            'Area' => $customer->Area ?? '',
            'City' => $customer->City ?? '',
            'State' => $customer->State ?? '',
            'PinCode' => $customer->PinCode ?? '',
            'IsUnderDistributor' => $customer->IsUnderDistributor ?? '',
            'DistributorName' => $customer->distributor->DistributorName ?? '--',
        ]);
    }


    public function orderCancelledCustomer($id)
    {
        $order = OrderModel::find($id);
        $order->OrderStatus = 'Cancelled';
        $order->save();
        return response()->json(['message' => 'Order cancelled successfully!']);
    }

    public function placeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'addressType' => 'required|string|in:Home,Office,Other,Default',
            'paymentMethod' => 'required|string',
            'deliveryCharge' => 'required|numeric|min:0',
            'itemsList' => 'required|array|min:1',
            'itemsList.*.Key' => 'required|integer',
            'itemsList.*.Quantity' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = auth()->user();

        $userId = $user->UserID;
        $branchid = $user->BranchID;
        $userrole = optional($user->role)->RoleName;

        DB::beginTransaction();

        try {
            $orderid = (OrderModel::max('OrderID') ?? 0) + 1;
            $orderno = "DM-" . $orderid;
            $orderDate = Carbon::now()->toDateString();

            $addressType = $request->addressType;
            $paymentMethod = $request->paymentMethod;
            $subtotal = $request->subTotal;
            $deliveryCharges = $request->deliveryCharge;
            $totalAmount = $request->totalAmount;
            $itemsList = $request->itemsList;

            OrderModel::create([
                'OrderID' => $orderid,
                'OrderNo' => $orderno,
                'PaymentOrderNo' => "0",
                'OrderDate' => $orderDate,
                'ClientID' => $userId,
                'UserType' => $userrole,
                'AddressTitle' => $addressType,
                'OrderStatus' => "Ordered",
                'OrderMode' => "Online",
                'PaymentMode' => $paymentMethod,
                'PaymentStatus' => "UnPaid",
                'SubTotal' => $subtotal,
                'DeliveryCharges' => $deliveryCharges,
                'TotalAmount' => $totalAmount,
                'Remark' => "Online Order Received",
                'BranchID' => $branchid,
            ]);

            foreach ($itemsList as $item) {

                $productId = $item['Key'];
                $branchPrice = BranchPriceModel::where('ProductID', $productId)
                    ->where('BranchID', $branchid)
                    ->first();

                $validPrice = $this->getValidPrice($branchPrice, $userrole, $userId);
                $amount = $item['Quantity'] * $validPrice;

                $ordertransid = (OrderTransModel::max('OrderTransID') ?? 0) + 1;

                OrderTransModel::create([
                    'OrderTransID' => $ordertransid,
                    'ProductID' => $item['Key'],
                    'Quantity' => $item['Quantity'],
                    'Rate' => $validPrice,
                    'Amount' => $amount,
                    'OrderID' => $orderid,
                ]);
            }

            $ordertrans = OrderTransModel::where('OrderID', $orderid)->get();
            $subtotal = $ordertrans->sum('Amount');
            $totalAmount = $subtotal + $deliveryCharges;

            OrderModel::where('OrderID', $orderid)->update([
                'SubTotal' => $subtotal,
                'TotalAmount' => $totalAmount,
            ]);

            DB::commit();

            return response()->json([
                'result' => 'Y',
                'status' => 'success',
                'message' => 'Order Placed Successfully',
                'order_id' => $orderid,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong !',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function getValidPrice($branchPrice, $role, $uid): float
    {
        if (!$branchPrice) {
            return 0;
        }

        $rolePriceMap = [
            'Customer' => 'CustomerPrice',
            'Institution' => 'InstitutionPrice',
            'NewInstitution' => 'NewInstitutionPrice',
        ];

        $column = $rolePriceMap[$role] ?? 'CustomerPrice';

        if ($role === 'Institution') {
            $ins = InstitutionModel::where('UserID', $uid)->first();

            if ($ins?->PriceType === 'NewInstitution') {
                $column = $rolePriceMap['NewInstitution'];
            }
        }

        return $branchPrice->{$column} ?? 0;
    }
    public function orderUpdateCustomer(Request $request)
    {
        $validated = $request->validate([
            'OrderID' => 'required|integer',
            'OrderDate' => 'required|date',

            'DeliveryCharges' => 'required|numeric',
            'Discount' => 'required|numeric',
            'Remark' => 'nullable|string|max:1000',
            'OrderTransModels' => 'required|array|min:1',
            'OrderTransModels.*.ProductID' => 'required|integer|exists:ProductModels,ProductID',
            'OrderTransModels.*.Quantity' => 'required|numeric|min:1',
            'OrderTransModels.*.Rate' => 'required|numeric',
        ]);

        $userId = auth()->id();
        $orderid = $validated['OrderID'];
        DB::beginTransaction();

        try {

            $order = OrderModel::findOrFail($orderid);

            $subTotal = 0;
            foreach ($validated['OrderTransModels'] as $item) {
                $subTotal += $item['Rate'] * $item['Quantity'];
            }

            $totalAmount = $subTotal + $validated['DeliveryCharges'] - $validated['Discount'];

            $order->update([
                'OrderDate' => $validated['OrderDate'],
                'SubTotal' => $subTotal,
                'DeliveryCharges' => $validated['DeliveryCharges'],
                'Discount' => $validated['Discount'],
                'TotalAmount' => $totalAmount,
                'Remark' => $validated['Remark'],
                'updated_by' => $userId,
            ]);

            OrderTransModel::where('OrderID', $orderid)->delete();

            $newId = (OrderTransModel::max('OrderTransID') ?? 0) + 1;

            foreach ($validated['OrderTransModels'] as $item) {
                OrderTransModel::create([
                    'OrderTransID' => $newId++,
                    'OrderID' => $orderid,
                    'ProductID' => $item['ProductID'],
                    'Rate' => $item['Rate'],
                    'Quantity' => $item['Quantity'],
                    'Amount' => $item['Rate'] * $item['Quantity'],
                    'updated_by' => $userId,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order updated successfully.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update order.',
                'error' => $e->getMessage(),
            ], 200);
        }
    }

    public function sendOrderConfirmationSms(Request $request)
    {
        $request->validate(
            [
                'orderid' => 'required|integer',
            ]
        );

        $orderid = $request->orderid;

        $user = auth()->user();
        $userId = $user->UserID;

        $order = OrderModel::where('OrderID', $orderid)
            ->where('ClientID', $userId)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found or does not belong to the user.'
            ], 404);
        }

        $mobile = $user->Mobile;
        $email = $user->Email;
        $name = $user->DisplayName;
        $amount = $order->TotalAmount;

        $data = [
            'template_id' => env('MSG91_SENDORDERCONFIRMATION'),
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
                'authkey' => env('MSG91_AUTHKEY'),
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ]
        )->post(
                'https://control.msg91.com/api/v5/flow',
                $data
            );

        if ($response->successful()) {

            return response()->json([
                'status' => 'success',
                'message' => 'Order confirmation SMS sent successfully.'
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send SMS.'
            ], 500);
        }
    }
}
