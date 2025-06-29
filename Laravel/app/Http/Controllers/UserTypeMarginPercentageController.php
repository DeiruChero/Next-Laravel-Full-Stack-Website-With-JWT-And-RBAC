<?php

namespace App\Http\Controllers;

use App\Models\UserTypeMarginPercentageModel;
use Illuminate\Http\Request;

class UserTypeMarginPercentageController extends Controller
{
    public function index(Request $request)
    {
        $query = UserTypeMarginPercentageModel::query();
        if ($search = $request->input('search')) {
            $query->where('UserType', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $userTypeMarginPercentages = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $userTypeMarginPercentages->map(function ($userTypeMarginPercentage) {
            return [
                'UserTypeMarginPercentageID' => $userTypeMarginPercentage->id,
                'UserType' => $userTypeMarginPercentage->UserType,
                'MarginPercentage' => $userTypeMarginPercentage->MarginPercentage,
                'TransportationCharges' => $userTypeMarginPercentage->TransportationCharges,
                'LabourCharges' => $userTypeMarginPercentage->LabourCharges,
                'BarcodeCharges' => $userTypeMarginPercentage->BarcodeCharges
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
            'UserType' => 'required|string|max:255',
            'MarginPercentage' => 'required',
            'TransportationCharges' => 'required',
            'LabourCharges' => 'required',
            'BarcodeCharges' => 'required',
        ]);
        $userId = auth()->id();
        $maxId = UserTypeMarginPercentageModel::max('id') ?? 0;
        $newId = $maxId + 1;
        UserTypeMarginPercentageModel::create([
            'id' => $newId,
            'UserType' => $validated['UserType'],
            'MarginPercentage' => $validated['MarginPercentage'],
            'TransportationCharges' => $validated['TransportationCharges'],
            'LabourCharges' => $validated['LabourCharges'],
            'BarcodeCharges' => $validated['BarcodeCharges'],
            // 'created_by' => $userId,
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'User type margin percentage created successfully!',
        ], 201);
    }
    public function show($id)
    {
        $userTypeMarginPercentage = UserTypeMarginPercentageModel::find($id);
        if (!$userTypeMarginPercentage) {
            return response()->json(['error' => 'User type margin percentage not found'], 404);
        }
        return response()->json($userTypeMarginPercentage);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'UserType' => 'required|string|max:255',
            'MarginPercentage' => 'required',
            'TransportationCharges' => 'required',
            'LabourCharges' => 'required',
            'BarcodeCharges' => 'required',
        ]);
        $userId = auth()->id();
        $userTypeMarginPercentage = UserTypeMarginPercentageModel::find($id);
        if (!$userTypeMarginPercentage) {
            return response()->json(['error' => 'User type margin percentage not found'], 404);
        }
        $userTypeMarginPercentage->UserType = $request->UserType;
        $userTypeMarginPercentage->MarginPercentage = $request->MarginPercentage;
        $userTypeMarginPercentage->TransportationCharges = $request->TransportationCharges;
        $userTypeMarginPercentage->LabourCharges = $request->LabourCharges;
        $userTypeMarginPercentage->BarcodeCharges = $request->BarcodeCharges;
        // $userTypeMarginPercentage->updated_by = $userId;
        $userTypeMarginPercentage->save();
        return response()->json([
            'status' => 'success',
            'message' => 'User type margin percentage updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $userTypeMarginPercentage = UserTypeMarginPercentageModel::find($id);
        if (!$userTypeMarginPercentage) {
            return response()->json(['error' => 'User type margin percentage not found'], 404);
        }
        $userTypeMarginPercentage->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'User type margin percentage deleted successfully'
        ], 200);
    }
}
