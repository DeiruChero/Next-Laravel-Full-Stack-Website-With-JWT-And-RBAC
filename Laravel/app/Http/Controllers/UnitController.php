<?php

namespace App\Http\Controllers;

use App\Models\UnitModel;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $query = UnitModel::query();
        if ($search = $request->input('search')) {
            $query->where('UnitName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $units = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $units->map(function ($unit) {
            return [
                'UnitID' => $unit->UnitID,
                'UnitName' => $unit->UnitName,
                'Remark' => $unit->Remark ?? '',
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
            'UnitName' => 'required|string|max:255',
            'Remark' => 'nullable|string|max:1000',
        ]);

        $userId = auth()->id();

        $maxId = UnitModel::max('UnitID') ?? 0;
        $newId = $maxId + 1;

        UnitModel::create([
            'UnitID' => $newId,
            'UnitName' => $validated['UnitName'],
            'Remark' => $validated['Remark'] ?? null,
            'created_by' => $userId,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Unit created successfully.',
        ], 201);
    }
    public function show($id)
    {
        $unit = UnitModel::find($id);
        if (!$unit) {
            return response()->json(['error' => 'Unit not found'], 404);
        }
        return response()->json($unit);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'UnitName' => 'required|string',
            'Remark' => 'nullable|string',
        ]);

        $userId = auth()->id();

        $unit = UnitModel::find($id);
        if (!$unit) {
            return response()->json(['error' => 'Unit not found'], 404);
        }
        $unit->UnitName = $request->UnitName;
        $unit->Remark = $request->Remark;
        $unit->updated_by = $userId;
        $unit->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Unit updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $unit = UnitModel::find($id);
        if (!$unit) {
            return response()->json(['error' => 'Unit not found'], 404);
        }
        $unit->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Unit deleted successfully'
        ], 200);
    }
}
