<?php

namespace App\Http\Controllers;

use App\Models\PackSizeModel;
use Illuminate\Http\Request;

class PackSizeController extends Controller
{
    public function index(Request $request)
    {
        $query = PackSizeModel::query();
        if ($search = $request->input('search')) {
            $query->where('PackSizeName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $packSizes = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $packSizes->map(function ($packSize) {
            return [
                'PackSizeID' => $packSize->PackSizeID,
                'PackSizeName' => $packSize->PackSizeName,
                'Facter' => $packSize->Facter,
            ];
        });
        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ], 200);
    }
    public function store(Request $request)
    {
        $request->validate([
            'PackSizeName' => 'required|string|max:255',
            'Facter' => 'required|numeric|min:0',
        ]);

        $newId = (PackSizeModel::max('PackSizeID') ?? 0) + 1;
        $userId = auth()->id();

        PackSizeModel::create([
            'PackSizeID' => $newId,
            'PackSizeName' => $request->PackSizeName,
            'Facter' => $request->Facter,
            'created_by' => $userId,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pack size created successfully!',
        ], 201);
    }
    public function show($id)
    {
        $packSize = PackSizeModel::find($id);
        if (!$packSize) {
            return response()->json(['error' => 'Pack size not found'], 404);
        }
        return response()->json($packSize);
    }
    public function destroy($id)
    {
        $packSize = PackSizeModel::find($id);
        if (!$packSize) {
            return response()->json(['error' => 'Pack size not found'], 404);
        }
        $packSize->delete();
        return response()->json(['message' => 'Pack size deleted successfully']);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'PackSizeName' => 'required|string|max:255',
            'Facter' => 'required|numeric|min:0',
        ]);

        $userId = auth()->id();

        $packSize = PackSizeModel::find($id);
        if (!$packSize) {
            return response()->json(['error' => 'Pack size not found'], 404);
        }
        $packSize->PackSizeName = $request->PackSizeName;
        $packSize->Facter = $request->Facter;
        $packSize->updated_by = $userId;
        $packSize->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Pack size updated successfully'
        ], 200);
    }
}
