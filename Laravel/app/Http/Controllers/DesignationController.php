<?php

namespace App\Http\Controllers;

use App\Models\DesignationModel;
use Illuminate\Http\Request;

use function Pest\Laravel\json;

class DesignationController extends Controller
{
    public function index(Request $request)
    {
        $query = DesignationModel::query();
        if ($search = $request->input('search')) {
            $query->where('DesignationName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $designations = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $designations->map(function ($designation) {
            return [
                'DesignationID' => $designation->DesignationID,
                'DesignationName' => $designation->DesignationName,
                'Remark' => $designation->Remark ?? '',
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
            'DesignationName' => 'required|string|max:255',
            'Remark' => 'nullable|string|max:1000',
        ]);

        $userId = auth()->id();

        $maxId = DesignationModel::max('DesignationID') ?? 0;
        $newId = $maxId + 1;

        DesignationModel::create([
            'DesignationID' => $newId,
            'DesignationName' => $validated['DesignationName'],
            'Remark' => $validated['Remark'] ?? null,
            'created_by' => $userId,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Designation created successfully.',
        ], 201);
    }
    public function show($id)
    {
        $designation = DesignationModel::find($id);
        if (!$designation) {
            return response()->json(['error' => 'Designation not found'], 404);
        }
        return response()->json($designation);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'DesignationName' => 'required|string',
            'Remark' => 'nullable|string',
        ]);

        $userId = auth()->id();

        $designation = DesignationModel::find($id);
        if (!$designation) {
            return response()->json(['error' => 'Designation not found'], 404);
        }
        $designation->DesignationName = $request->DesignationName;
        $designation->Remark = $request->Remark;
        $designation->updated_by = $userId;
        $designation->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Designation updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $designation = DesignationModel::find($id);
        if (!$designation) {
            return response()->json(['error' => 'Designation not found'], 404);
        }
        $designation->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Designation deleted successfully'
        ], 200);
    }
}
