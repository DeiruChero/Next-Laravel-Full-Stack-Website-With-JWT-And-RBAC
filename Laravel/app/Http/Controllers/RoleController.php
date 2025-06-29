<?php

namespace App\Http\Controllers;

use App\Models\RoleModel;
use App\Models\RoleRulesModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = RoleModel::query();
        if ($search = $request->input('search')) {
            $query->where('RoleName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $roles = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $roles->map(function ($role) {
            return [
                'RoleID' => $role->RoleID,
                'RoleName' => $role->RoleName,
                'Remark' => $role->Remark ?? ''
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
            'role_name' => 'required|string|max:255',
            'role_remark' => 'nullable|string|max:255',
            'rules' => 'nullable|array',
            'rules.*' => 'integer|exists:RulesModels,RulesID',
        ]);

        try {
            $role = RoleModel::create([
                'RoleName' => $request->input('role_name'),
                'Remark' => $request->input('role_remark'),
            ]);

            $rules = $request->input('rules', []);
            foreach ($rules as $ruleId) {
                RoleRulesModel::create([
                    'RoleID' => $role->RoleID,
                    'RulesID' => $ruleId
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Role created successfully!'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Role creation failed:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'error' => 'Something went wrong.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    public function show($id)
    {
        $role = RoleModel::find($id);
        $ruleID = RoleRulesModel::where('RoleID', $id)->pluck('RulesID');

        if (!$role) {
            return response()->json(['error' => 'Role not found'], 404);
        }

        return response()->json(['role' => $role, 'rules' => $ruleID]);
    }

    public function update(Request $request, $id)
    {
        $role = RoleModel::find($id);

        if (!$role) {
            return response()->json(['error' => 'Role not found'], 404);
        }

        $validated = $request->validate([
            'RoleName' => 'required|string|max:255',
            'Remark' => 'nullable|string|max:255',
            'RulesID' => 'nullable|array',
            'RulesID.*' => 'integer|exists:RulesModels,RulesID',
        ]);

        $role->RoleName = $validated['RoleName'];
        $role->Remark = $validated['Remark'] ?? null;
        $role->save();

        if (isset($validated['RulesID'])) {
            $role->rules()->sync($validated['RulesID']);
        } else {
            $role->rules()->detach();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Role updated successfully',
            'role' => $role
        ], 200);
    }
    public function destroy($id)
    {
        $role = RoleModel::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found.'], 404);
        }

        $role->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Role deleted successfully.'
        ], 200);
    }
}
