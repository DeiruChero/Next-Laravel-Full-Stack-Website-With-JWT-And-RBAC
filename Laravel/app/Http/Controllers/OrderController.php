<?php

namespace App\Http\Controllers;

use App\Models\OrderAsignModel;
use App\Models\OrderModel;
use App\Models\OrderTransModel;
use DB;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {

        $user = auth()->user();

        $query = OrderModel::with(['user.role', 'branch']);

        if ($user->BranchID != 0) {
            $query->where('BranchID', $user->BranchID);
        } elseif ($request->has('branchid')) {
            $query->where('BranchID', $request->input('branchid'));
        }


        if ($search = $request->input('search')) {
            $query->where('OrderNo', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $orders = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $orders->map(function ($order) {
            return [
                'OrderID' => $order->OrderID,
                'OrderNo' => $order->OrderNo,
                'OrderDate' => $order->OrderDate,
                'OrderTime' => $order->OrderTime,
                'ClientName' => $order->user->DisplayName ?? '',
                'UserRole' => $order->user->role->RoleName ?? '',
                'Branch' => $order->branch->ShortName ?? '',
                'OrderStatus' => $order->OrderStatus,
                'OrderMode' => $order->OrderMode,
                'PaymentMode' => $order->PaymentMode,
                'PaymentStatus' => $order->PaymentStatus,
                'TotalAmount' => $order->TotalAmount,
            ];
        });
        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ], 200);
    }
    public function latestOrderNo()
    {
        $latestOrder = OrderModel::latest()->first();

        if ($latestOrder && preg_match('/DM-(\d+)/', $latestOrder->OrderNo, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
            $nextOrderNo = 'DM-' . $nextNumber;
        } else {
            $nextOrderNo = 'DM-1001';
        }

        return response()->json(['nextOrderNo' => $nextOrderNo], 200);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'OrderTransModels' => 'required|array|min:1',
            'OrderTransModels.*.ProductID' => 'required|integer|exists:ProductModels,ProductID',
            'OrderTransModels.*.Quantity' => 'required|numeric|min:1',
            'OrderTransModels.*.Rate' => 'required|numeric',
            'OrderTransModels.*.Amount' => 'required|numeric',
            'OrderDate' => 'required',
            'SubTotal' => 'required|numeric',
            'DeliveryCharges' => 'required|numeric',
            'Remark' => 'nullable|string|max:1000',
            'Discount' => 'required|numeric',
            'ClientID' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $user = auth()->user();
            $userId = $user->UserID;
            $branchId = $user->BranchID;

            $newOrderId = (OrderModel::max('OrderID') ?? 0) + 1;
            $orderNo = "DM-" . $newOrderId;

            $subTotal = 0;

            foreach ($validated['OrderTransModels'] as $item) {
                $subTotal += $item['Quantity'] * $item['Rate'];
            }

            $totalAmount = $subTotal + $validated['DeliveryCharges'] - $validated['Discount'];

            OrderModel::create([
                'OrderID' => $newOrderId,
                'OrderNo' => $orderNo,
                'PaymentOrderNo' => 0,
                'OrderDate' => $validated['OrderDate'],
                'ClientID' => $validated['ClientID'],
                'OrderStatus' => 'Ordered',
                'OrderMode' => 'Self',
                'AddressTitle' => 'Default',
                'PaymentMode' => 'Credit',
                'PaymentStatus' => 'UnPaid',
                'SubTotal' => $subTotal,
                'DeliveryCharges' => $validated['DeliveryCharges'],
                'TotalAmount' => $totalAmount,
                'Remark' => $validated['Remark'],
                'BranchID' => $branchId,
                'PONumber' => 'NA',
                'PODate' => now(),
                'Discount' => $validated['Discount'],
                'UserType' => 'Customer',
                'created_by' => $userId,
            ]);

            $newOrderTransId = (OrderTransModel::max('OrderTransID') ?? 0) + 1;

            foreach ($validated['OrderTransModels'] as $item) {
                OrderTransModel::create([
                    'OrderTransID' => $newOrderTransId++,
                    'ProductID' => $item['ProductID'],
                    'Quantity' => $item['Quantity'],
                    'Rate' => $item['Rate'],
                    'Amount' => $item['Quantity'] * $item['Rate'],
                    'created_by' => $userId,
                    'OrderID' => $newOrderId,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Customer Order created successfully!'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create order.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function materialPreview(Request $request)
    {
        $orderList = $request->input('list');

        if (empty($orderList)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or empty order list.'
            ]);
        }

        $orderCount = count($orderList);

        $result = OrderTransModel::with([
            'product.unit:UnitID,UnitName',
            'product.packsize:PackSizeID,Facter',
            'product.category:CategoryID,CategoryName',
            'product.group:GroupID,GroupName',
        ])
            ->selectRaw('"ProductID", SUM("Quantity") as "TotalQuantity"')
            ->whereIn('OrderID', $orderList)
            ->groupBy('ProductID')
            ->get();

        $finalResult = $result
            ->groupBy(fn($item) => optional($item->product->group)->GroupID)
            ->map(function ($group) {
                $groupName = optional($group->first()->product->group)->GroupName ?? 'NA';

                $totalAmount = $group->reduce(function ($carry, $item) {
                    $factor = $item->product->packsize->Facter ?? 1;
                    return $carry + ($item->TotalQuantity * $factor);
                }, 0);

                return [
                    'GroupID' => optional($group->first()->product->group)->GroupID,
                    'GroupName' => $groupName,
                    'TotalAmount' => $totalAmount,
                    'Products' => $group->map(function ($item) {
                        $product = $item->product;
                        $unit = $product->unit;
                        $packsize = $product->packsize;
                        $category = $product->category;

                        return [
                            'ProductID' => $product->ProductID,
                            'ProductName' => $product->ProductName,
                            'ProductUnicodeName' => $product->ProductUnicodeName,
                            'TotalQuantity' => $item->TotalQuantity,
                            'UnitName' => $unit->UnitName,
                            'Factor' => $packsize->Facter,
                            'Amount' => $item->TotalQuantity * $packsize->Facter,
                            'CategoryName' => $category->CategoryName,
                        ];
                    })->values()
                ];
            })->values();

        return response()->json([
            'status' => 'success',
            'orderCount' => $orderCount,
            'data' => $finalResult,
        ]);
    }

    public function getOrdersByDate(Request $request)
    {

        $date = $request->input('date');
        $user = auth()->user();

        $query = OrderModel::with(['user.role', 'branch'])->whereDate('OrderDate', $date);

        if ($user->BranchID != 0) {
            $query->where('BranchID', $user->BranchID);
        } elseif ($request->has('branchid')) {
            $query->where('BranchID', $request->input('branchid'));
        }

        if ($search = $request->input('search')) {
            $query->where('OrderID', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $totalAmount = $query->sum('TotalAmount');
        $orders = $query->get();

        $formatted = $orders->map(function ($order) {
            return [
                'OrderID' => $order->OrderID,
                'OrderNo' => $order->OrderNo,
                'OrderDate' => $order->OrderDate,
                'ClientName' => $order->user->DisplayName ?? '',
                'UserRole' => $order->user->role->RoleName ?? '',
                'Branch' => $order->branch->ShortName ?? '',
                'OrderStatus' => $order->OrderStatus,
                'OrderMode' => $order->OrderMode,
                'PaymentMode' => $order->PaymentMode,
                'PaymentStatus' => $order->PaymentStatus,
                'TotalAmount' => $order->TotalAmount,
            ];
        });
        return response()->json([
            'data' => $formatted,
            'totalRecords' => $formatted->count(),
            'totalAmount' => $totalAmount,
        ], 200);

    }

    public function getOrdersByStatus(Request $request)
    {

        $status = $request->input('status');
        $user = auth()->user();

        $query = OrderModel::with(['user.role', 'branch'])->where('OrderStatus', $status);

        if ($user->BranchID != 0) {
            $query->where('BranchID', $user->BranchID);
        } elseif ($request->has('branchid')) {
            $query->where('BranchID', $request->input('branchid'));
        }

        if ($search = $request->input('search')) {
            $query->where('OrderID', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }


        $total = $query->count();
        $orders = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();

        $formatted = $orders->map(function ($order) {
            return [
                'OrderID' => $order->OrderID,
                'OrderNo' => $order->OrderNo,
                'OrderDate' => $order->OrderDate,
                'ClientName' => $order->user->DisplayName ?? '',
                'UserRole' => $order->user->role->RoleName ?? '',
                'Branch' => $order->branch->ShortName ?? '',
                'OrderStatus' => $order->OrderStatus,
                'OrderMode' => $order->OrderMode,
                'PaymentMode' => $order->PaymentMode,
                'PaymentStatus' => $order->PaymentStatus,
                'TotalAmount' => $order->TotalAmount,
            ];
        });
        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ], 200);

    }
}
