<?php

namespace App\Http\Controllers;

use App\Models\RoleModel;
use App\Models\RulesModel;
use App\Models\UserModel;
use App\Models\UserRulesModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RuleController extends Controller
{
    public function index(Request $request)
    {
        $query = RulesModel::query();
        if ($search = $request->input('search')) {
            $query->where('RulesName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $rules = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $rules->map(function ($rule) {
            return [
                'RulesID' => $rule->RulesID,
                'RulesName' => $rule->RulesName,
                'Link' => $rule->Link,
                'RulesGroup' => $rule->RulesGroup,
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
            'rule_name' => 'required|string',
            'route' => 'required|string',
            'group_name' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            $rule = RulesModel::create([
                'RulesName' => $request->rule_name,
                'Link' => $request->route,
                'RulesGroup' => $request->group_name,
            ]);

            Log::info('Rule created:', ['rule' => $rule]);

            $superAdminRole = RoleModel::where('RoleName', 'Super Admin')->first();
            Log::info('Super Admin role:', ['role' => $superAdminRole]);

            if ($superAdminRole) {
                $superAdminUsers = UserModel::where('RoleID', $superAdminRole->RoleID)->get();
                Log::info('Super Admin users:', ['users' => $superAdminUsers]);

                foreach ($superAdminUsers as $user) {
                    UserRulesModel::create([
                        'UserID' => $user->UserID,
                        'RulesID' => $rule->RulesID,
                    ]);
                    Log::info('Assigned rule to user:', ['UserID' => $user->UserID]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Rule created and assigned to Super Admin users successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating rule: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create rule: ' . $e->getMessage()], 500);
        }
    }
    public function show($id)
    {
        $rule = RulesModel::find($id);
        return response()->json($rule);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'RulesName' => 'required|string',
            'RulesGroup' => 'required|string',
            'Link' => 'required|string',
        ]);
        $rule = RulesModel::findOrFail($id);
        $rule->update($request->all());
        return response()->json([
            'success' => 'success',
            'message' => 'Rule updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $rule = RulesModel::find($id);

        if (!$rule) {
            return response()->json(['message' => 'Rule not found'], 404);
        }

        $rule->delete();

        return response()->json(['message' => 'Rule deleted successfully']);
    }
}
