<?php

namespace App\Http\Controllers;

use App\Models\StateModel;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index(Request $request)
    {
        $query = StateModel::with(['country:CountryID,CountryName']);
        if ($search = $request->input('search')) {
            $query->where('StateName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $states = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $states->map(function ($state) {
            return [
                'StateID' => $state->StateID,
                'StateName' => $state->StateName,
                'CountryName' => $state->country->CountryName ?? '',
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
            'StateName' => 'required|string|max:255',
        ]);
        $incid = StateModel::max('StateID') ?? 0;
        $incid = $incid + 1;
        $request['StateID'] = $incid;
        $request['CountryID'] = 95;
        StateModel::create($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'State created successfully!'
        ], 201);
    }
    public function show($id)
    {
        $state = StateModel::with(['country:CountryID,CountryName'])->find($id);
        return response()->json($state);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'StateName' => 'required|string|max:255',
        ]);
        StateModel::find($id)->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'State updated successfully!'
        ], 200);
    }
    public function destroy($id)
    {
        StateModel::find($id)->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'State deleted successfully!'
        ], 200);
    }
}
