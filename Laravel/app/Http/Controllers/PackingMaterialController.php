<?php

namespace App\Http\Controllers;

use App\Models\PackingMaterialModel;
use Illuminate\Http\Request;

class PackingMaterialController extends Controller
{
    public function index(Request $request)
    {
        $query = PackingMaterialModel::query();
        if ($search = $request->input('search')) {
            $query->where('PackingMaterialName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $packingMaterials = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $packingMaterials->map(function ($packingMaterial) {
            return [
                'PackingMaterialID' => $packingMaterial->PackingMaterialID,
                'PackingMaterialName' => $packingMaterial->PackingMaterialName,
                'Weight' => $packingMaterial->Weight,
                'PcsPerUnit' => $packingMaterial->PcsPerUnit,
                'PackagingCost' => $packingMaterial->PackagingCost,
            ];
        });
        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ], 200);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'PackingMaterialName' => 'required|string|max:255',
            'Weight' => 'required|numeric',
            'PcsPerUnit' => 'required|numeric',
            'PurchaseUnit' => 'required|string|max:255',
            'MinimumPurchaseQty' => 'required|numeric',
            'PackagingCost' => 'required|numeric',
            'BranchID' => 'required|integer',
            'Remark' => 'nullable|string|max:500',
        ]);

        $maxId = PackingMaterialModel::max('PackingMaterialID') ?? 0;
        $nextId = $maxId + 1;

        $packingMaterial = PackingMaterialModel::create([
            'PackingMaterialID' => $nextId,
            'PackingMaterialName' => $validated['PackingMaterialName'],
            'Weight' => $validated['Weight'],
            'PcsPerUnit' => $validated['PcsPerUnit'],
            'PurchaseUnit' => $validated['PurchaseUnit'],
            'MinimumPurchaseQty' => $validated['MinimumPurchaseQty'],
            'PackagingCost' => $validated['PackagingCost'],
            'BranchID' => $validated['BranchID'],
            'Remark' => $validated['Remark'] ?? null,
        ]);

        return response()->json([
            'message' => 'Packing material created successfully',
            'data' => $packingMaterial,
        ], 201);
    }
    public function show($id)
    {
        return response()->json(PackingMaterialModel::find($id));
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'PackingMaterialName' => 'required|string|max:255',
            'Weight' => 'required|numeric',
            'PcsPerUnit' => 'required|numeric',
            'PurchaseUnit' => 'required|string|max:255',
            'MinimumPurchaseQty' => 'required|numeric',
            'PackagingCost' => 'required|numeric',
            'BranchID' => 'required|integer',
            'Remark' => 'nullable|string|max:500',
        ]);

        $packingMaterial = PackingMaterialModel::find($id);

        if (!$packingMaterial) {
            return response()->json([
                'message' => 'Packing material not found',
            ], 404);
        }

        $packingMaterial->update([
            'PackingMaterialName' => $validated['PackingMaterialName'],
            'Weight' => $validated['Weight'],
            'PcsPerUnit' => $validated['PcsPerUnit'],
            'PurchaseUnit' => $validated['PurchaseUnit'],
            'MinimumPurchaseQty' => $validated['MinimumPurchaseQty'],
            'PackagingCost' => $validated['PackagingCost'],
            'BranchID' => $validated['BranchID'],
            'Remark' => $validated['Remark'] ?? null,
        ]);

        return response()->json([
            'message' => 'Packing material updated successfully',
            'data' => $packingMaterial,
        ], 200);
    }
    public function destroy($id)
    {
        $packingMaterial = PackingMaterialModel::find($id);
        if (!$packingMaterial) {
            return response()->json([
                'message' => 'Packing material not found',
            ], 404);
        }
        $packingMaterial->delete();
        return response()->json([
            'message' => 'Packing material deleted successfully',
        ], 200);
    }
    public function packingMaterialData()
    {
        $packingMaterials = PackingMaterialModel::select(
            'PackingMaterialID',
            'PackingMaterialName',
            'PurchaseUnit',
            'MinimumPurchaseQty',
            'PackagingCost'
        )->get();

        return response()->json([
            'data' => $packingMaterials
        ]);
    }
}
