<?php

namespace App\Http\Controllers;

use App\Models\GroupModel;
use Illuminate\Http\Request;

use function Pest\Laravel\json;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $query = GroupModel::query();
        if ($search = $request->input('search')) {
            $query->where('GroupName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $groups = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $groups->map(function ($group) {
            return [
                'GroupID' => $group->GroupID,
                'GroupName' => $group->GroupName,
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
            'GroupName' => 'required|string|max:255',
        ]);
        $group = GroupModel::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Product group created successfully!',
        ], 201);
    }
    public function show($id)
    {
        return response()->json(GroupModel::find($id));
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'GroupName' => 'required|string|max:255',
        ]);
        $group = GroupModel::find($id);
        if (!$group) {
            return response()->json(['error' => 'Product Group not found'], 404);
        }
        $group->GroupName = $request->GroupName;
        $group->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Product Group updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $group = GroupModel::find($id);
        if (!$group) {
            return response()->json(['error' => 'Product Group not found'], 404);
        }
        $group->delete();
        return response()->json(['message' => 'Product Group deleted successfully']);
    }
}
