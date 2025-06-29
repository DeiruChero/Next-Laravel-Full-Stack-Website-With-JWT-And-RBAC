<?php

namespace App\Http\Controllers;

use App\Models\OrderModel;
use App\Models\OrderTransModel;
use App\Models\QuickCommerceModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RelianceOrderController extends Controller
{
    public function index()
    {
        $platforms = QuickCommerceModel::where('ProductName', 'NameRelience')
            ->whereHas('user', function ($query) {
                $query->where('UserType', 'Quick Commerce');
            })
            ->with(['user:UserID,UserID,UserType'])
            ->select(['UserID', 'PlatformName'])
            ->get()
            ->map(function ($item) {
                return [
                    'UserID' => $item->UserID,
                    'UserType' => $item->user?->UserType,
                    'PlatformName' => $item->PlatformName,
                ];
            });

        return response()->json($platforms);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'OrderTransModels' => 'required|array|min:1',
            'OrderTransModels.*.ProductID' => 'required|integer|exists:ProductModels,ProductID',
            'OrderTransModels.*.Quantity' => 'required',
            'OrderTransModels.*.Rate' => 'required',
            'OrderTransModels.*.Amount' => 'required',
            'OrderNo' => 'required',
            'OrderDate' => 'required',
            'SubTotal' => 'required',
            'DeliveryCharges' => 'nullable',
            'TotalAmount' => 'required',
            'Discount' => 'nullable',
            'PONumber' => 'nullable',
            'PODate' => 'required',
            'Remark' => 'nullable|string|max:1000',
        ]);
        $userId = auth()->id();
        $branchId = auth()->user()->BranchID;
        $maxId = OrderTransModel::max('OrderTransID') ?? 0;
        $newId = $maxId + 1;
        $maxId2 = OrderModel::max('OrderID') ?? 0;
        $newId2 = $maxId2 + 1;
        $orderNo = $validated['OrderNo'];
        preg_match('/\d+/', $orderNo, $matches);
        $orderId = isset($matches[0]) ? (int)$matches[0] : null;

        if (!$orderId) {
            return response()->json(['error' => 'Invalid OrderNo format.'], 400);
        }
        OrderModel::create([
            'OrderID' => $newId2++,
            'OrderNo' => $validated['OrderNo'],
            'PaymentOrderNo' => 0,
            'OrderDate' => $validated['OrderDate'],
            'ClientID' => $userId,
            'OrderStatus' => 'Ordered',
            'OrderMode' => 'Self',
            'AddressTitle' => 'Default',
            'PaymentMode' => 'Credit',
            'PaymentStatus' => 'UnPaid',
            'SubTotal' => $validated['SubTotal'],
            'DeliveryCharges' => $validated['DeliveryCharges'],
            'TotalAmount' => $validated['TotalAmount'],
            'Remark' => $validated['Remark'],
            'BranchID' => $branchId,
            'PONumber' => $validated['PONumber'],
            'PODate' => $validated['PODate'],
            'Discount' => $validated['Discount'],
            'UserType' => 'QuickCommerce',
            // 'DeliveredDate' => now(),
            // 'DeliveredTime' => now(),
            'created_by' => $userId,
            'created_at' => now(),
        ]);
        foreach ($validated['OrderTransModels'] as $item) {
            OrderTransModel::create([
                'OrderTransID' => $newId++,
                'ProductID' => $item['ProductID'],
                'Quantity' => $item['Quantity'],
                'Rate' => $item['Rate'],
                'Amount' => $item['Amount'],
                'created_by' => $userId,
                'created_at' => now(),
                'OrderID' => $orderId
            ]);
        }

        return response()->json(['message' => 'Reliance Order created successfully!']);
    }
    public function orderCancelData(Request $request)
    {
        $query = OrderModel::whereNotIn('OrderStatus', ['Delivered', 'Cancelled'])
            ->whereHas('client.role', function ($query) {
                $query->where('RoleName', 'Quick Commerce');
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
        $order = OrderModel::with('client')->find($id);

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

        return response()->json([
            'OrderID' => $order->OrderID,
            'OrderNo' => $order->OrderNo,
            'OrderDate' => $order->OrderDate,
            'DisplayName' => $order->client->DisplayName ?? '',
            'Remark' => $order->Remark,
            'items' => $items
        ]);
    }
    public function orderEditReliance(Request $request, $id)
    {
        $validated = $request->validate([
            'OrderID' => 'required|numeric|min:0',
            'OrderDate' => 'required|date',
            'SubTotal' => 'required|min:0',
            'DeliveryCharges' => 'nullable|numeric',
            'Discount' => 'nullable|numeric',
            'TotalAmount' => 'required|min:0',
            'Remark' => 'nullable|string|max:1000',
            'OrderTransModels' => 'required|array|min:1',
            'OrderTransModels.*.ProductID' => 'required|integer|exists:ProductModels,ProductID',
            'OrderTransModels.*.Quantity' => 'required|numeric',
            'OrderTransModels.*.Rate' => 'required|numeric',
            'OrderTransModels.*.Amount' => 'required|numeric',
        ]);

        $userId = auth()->id();

        DB::transaction(function () use ($validated, $id, $userId) {
            $purchase = OrderModel::findOrFail($id);

            $purchase->update([
                'OrderDate' => $validated['OrderDate'],
                'SubTotal' => $validated['SubTotal'],
                'DeliveryCharges' => $validated['DeliveryCharges'],
                'Discount' => $validated['Discount'],
                'TotalAmount' => $validated['TotalAmount'],
                'Remark' => $validated['Remark'],
                'updated_by' => $userId,
                'updated_at' => now(),
            ]);

            OrderTransModel::where('OrderID', $validated['OrderID'])->delete();

            $maxId = OrderTransModel::max('OrderTransID') ?? 0;
            $newId = $maxId + 1;

            foreach ($validated['OrderTransModels'] as $item) {
                OrderTransModel::create([
                    'OrderTransID' => $newId++,
                    'OrderID' => $validated['OrderID'],
                    'ProductID' => $item['ProductID'],
                    'Rate' => $item['Rate'],
                    'Quantity' => $item['Quantity'],
                    'Amount' => $item['Amount'],
                    'updated_by' => $userId,
                    'updated_at' => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Reliance order updated successfully.']);
    }
}
