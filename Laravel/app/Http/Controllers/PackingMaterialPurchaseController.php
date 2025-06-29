<?php

namespace App\Http\Controllers;

use App\Models\PackingMaterialPurchaseModel;
use App\Models\PackingMaterialPurchaseTransModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PackingMaterialPurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = PackingMaterialPurchaseModel::query();
        if ($search = $request->input('search')) {
            $query->where('PurchaseInvoiceNo', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $purchases = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $purchases->map(function ($purchase) {
            return [
                'PurchaseID' => $purchase->PurchaseID,
                'PurchaseInvoiceNo' => $purchase->PurchaseInvoiceNo,
                'PurchaseDate' => $purchase->PurchaseDate,
                'GrandTotal' => $purchase->GrandTotal,
                'PaymentStatus' => $purchase->PaymentStatus,
                'VendorID' => $purchase->VendorID,
                'VendorName' => $purchase->purchase->VenderName
            ];
        });
        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ], 200);
    }
    public function purchaseInvoiceNo()
    {
        $latestOrder = PackingMaterialPurchaseModel::latest()->first();

        if ($latestOrder && preg_match('/PI-(\d+)/', $latestOrder->PurchaseInvoiceNo, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
            $nextOrderNo = 'PI-' . $nextNumber;
        } else {
            $nextOrderNo = 'PI-1001';
        }

        return response()->json(['nextOrderNo' => $nextOrderNo], 200);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'PurchaseInvoiceNo' => 'required|string|max:255',
            'PurchaseDate' => 'required|date',
            'GrandTotal' => 'required|min:0',
            'PaymentStatus' => 'required|string|max:255',
            'VendorID' => 'required|numeric|min:0',
            'OtherCharges' => 'nullable',
            'Remark' => 'nullable|string|max:1000',
            'Subtotal' => 'required|min:0',
            'OrderTransModels' => 'required|array|min:1',
            'OrderTransModels.*.PackingMaterialID' => 'required|integer|exists:PackingMaterialModels,PackingMaterialID',
            'OrderTransModels.*.PurchaseInvoiceNo' => 'required|string|max:255',
            'OrderTransModels.*.PurchaseUnit' => 'required|string|max:255',
            'OrderTransModels.*.Quantity' => 'required',
            'OrderTransModels.*.RatePerUnit' => 'required',
            'OrderTransModels.*.Amount' => 'required'
        ]);
        $userId = auth()->id();
        $branchId = auth()->user()->BranchID;
        $maxId = PackingMaterialPurchaseTransModel::max('PurchaseTransID') ?? 0;
        $newId = $maxId + 1;
        $maxId2 = PackingMaterialPurchaseModel::max('PurchaseID') ?? 0;
        $newId2 = $maxId2 + 1;
        $purchaseInvoiceNo = $validated['PurchaseInvoiceNo'];
        preg_match('/\d+/', $purchaseInvoiceNo, $matches);
        $purchaseId = isset($matches[0]) ? (int)$matches[0] : null;

        if (!$purchaseId) {
            return response()->json(['error' => 'Invalid PurchaseInvoiceNo format.'], 400);
        }
        PackingMaterialPurchaseModel::create([
            'PurchaseID' => $newId2++,
            'PurchaseInvoiceNo' => $validated['PurchaseInvoiceNo'],
            'PurchaseDate' => $validated['PurchaseDate'],
            'Subtotal' => $validated['Subtotal'],
            'OtherCharges' => $validated['OtherCharges'],
            'GrandTotal' => $validated['GrandTotal'],
            'PaymentStatus' => $validated['PaymentStatus'],
            'VendorID' => $validated['VendorID'],
            'BranchID' => $branchId,
            'Remark' => $validated['Remark'],
            'created_by' => $userId,
            'created_at' => now(),
        ]);
        foreach ($validated['OrderTransModels'] as $item) {
            PackingMaterialPurchaseTransModel::create([
                'PurchaseTransID' => $newId++,
                'PurchaseInvoiceNo' => $item['PurchaseInvoiceNo'],
                'PackingMaterialID' => $item['PackingMaterialID'],
                'RatePerUnit' => $item['RatePerUnit'],
                'PurchaseUnit' => $item['PurchaseUnit'],
                'Quantity' => $item['Quantity'],
                'Amount' => $item['Amount'],
                'created_by' => $userId,
                'created_at' => now(),
            ]);
        }
        return response()->json(['message' => 'Packing Material order created successfully!']);
    }
    public function showInfo($id)
    {
        $purchase = PackingMaterialPurchaseModel::with('vendor:VenderID,VenderID,VenderName')
            ->select('PurchaseID', 'PurchaseInvoiceNo', 'PurchaseDate', 'VendorID', 'Subtotal', 'OtherCharges', 'GrandTotal', 'PaymentStatus', 'BranchID', 'Remark')
            ->find($id);

        $items = PackingMaterialPurchaseTransModel::with('material:PackingMaterialID,PackingMaterialName')
            ->where('PurchaseInvoiceNo', $purchase->PurchaseInvoiceNo)
            ->select('PurchaseTransID', 'PackingMaterialID', 'RatePerUnit', 'PurchaseUnit', 'Quantity', 'Amount')
            ->get()
            ->map(function ($item) {
                return [
                    'PurchaseTransID' => $item->PurchaseTransID,
                    'PackingMaterialID' => $item->material->PackingMaterialID ?? '',
                    'PackingMaterialName' => $item->material->PackingMaterialName ?? '',
                    'RatePerUnit' => $item->RatePerUnit,
                    'PurchaseUnit' => $item->PurchaseUnit,
                    'Quantity' => $item->Quantity,
                    'Amount' => $item->Amount
                ];
            });

        if (!$purchase) {
            return response()->json(['error' => 'Purchase not found'], 404);
        }

        return response()->json([
            'PurchaseID' => $purchase->PurchaseID,
            'PurchaseInvoiceNo' => $purchase->PurchaseInvoiceNo,
            'PurchaseDate' => $purchase->PurchaseDate,
            'VenderName' => $purchase->vendor?->VenderName ?? '',
            'Remark' => $purchase->Remark,
            'OtherCharges' => $purchase->OtherCharges,
            'VenderID' => $purchase->VendorID,
            'items' => $items
        ]);
    }
    public function destroy($id)
    {
        $purchase = PackingMaterialPurchaseModel::find($id);
        if (!$purchase) {
            return response()->json(['error' => 'Purchase not found'], 404);
        }
        $invoiceNo = $purchase->PurchaseInvoiceNo;
        PackingMaterialPurchaseTransModel::where('PurchaseInvoiceNo', $invoiceNo)->delete();
        $purchase->delete();
        return response()->json(['message' => 'Purchase and its items deleted successfully.']);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'PurchaseInvoiceNo' => 'required|string|max:255',
            'PurchaseDate' => 'required|date',
            'Subtotal' => 'required|min:0',
            'OtherCharges' => 'nullable|numeric',
            'GrandTotal' => 'required|min:0',
            'PaymentStatus' => 'required|string|max:255',
            'VendorID' => 'required|numeric|min:0',
            'Remark' => 'nullable|string|max:1000',
            'OrderTransModels' => 'required|array|min:1',
            'OrderTransModels.*.PackingMaterialID' => 'required|integer|exists:PackingMaterialModels,PackingMaterialID',
            'OrderTransModels.*.PurchaseUnit' => 'required|string|max:255',
            'OrderTransModels.*.Quantity' => 'required|numeric',
            'OrderTransModels.*.RatePerUnit' => 'required|numeric',
            'OrderTransModels.*.Amount' => 'required|numeric',
        ]);

        $userId = auth()->id();

        DB::transaction(function () use ($validated, $id, $userId) {
            $purchase = PackingMaterialPurchaseModel::findOrFail($id);

            $purchase->update([
                'PurchaseDate' => $validated['PurchaseDate'],
                'Subtotal' => $validated['Subtotal'],
                'OtherCharges' => $validated['OtherCharges'],
                'GrandTotal' => $validated['GrandTotal'],
                'PaymentStatus' => $validated['PaymentStatus'],
                'VendorID' => $validated['VendorID'],
                'Remark' => $validated['Remark'],
                'updated_by' => $userId,
                'updated_at' => now(),
            ]);

            PackingMaterialPurchaseTransModel::where('PurchaseInvoiceNo', $validated['PurchaseInvoiceNo'])->delete();

            $maxId = PackingMaterialPurchaseTransModel::max('PurchaseTransID') ?? 0;
            $newId = $maxId + 1;

            foreach ($validated['OrderTransModels'] as $item) {
                PackingMaterialPurchaseTransModel::create([
                    'PurchaseTransID' => $newId++,
                    'PurchaseInvoiceNo' => $validated['PurchaseInvoiceNo'],
                    'PackingMaterialID' => $item['PackingMaterialID'],
                    'RatePerUnit' => $item['RatePerUnit'],
                    'PurchaseUnit' => $item['PurchaseUnit'],
                    'Quantity' => $item['Quantity'],
                    'Amount' => $item['Amount'],
                    'created_by' => $userId,
                    'created_at' => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Packing Material Purchase updated successfully.']);
    }
}
