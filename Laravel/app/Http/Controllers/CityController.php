<?php

namespace App\Http\Controllers;

use App\Models\CityModel;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $query = CityModel::with(['state:StateID,StateName']);
        if ($search = $request->input('search')) {
            $query->where('CityName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $cities = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $cities->map(function ($city) {
            return [
                'CityID' => $city->CityID,
                'CityName' => $city->CityName,
                'StateName' => $city->state->StateName ?? '',
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
            'CityName' => 'required|string|max:255',
        ]);
        $incid = CityModel::max('CityID') ?? 0;
        $incid++;

        $userId = auth()->id();

        $data = $request->all();
        $data['CityID'] = $incid;
        $data['created_by'] = $userId;

        $city = CityModel::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'City created successfully',
        ], 201);
    }
    public function show($id)
    {
        $city = CityModel::with(['state:StateID,StateName'])->find($id);
        return response()->json($city);
    }
    public function destroy($id)
    {
        $city = CityModel::find($id);
        if (!$city) {
            return response()->json(['error' => 'City not found'], 404);
        }
        $city->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'City deleted successfully'
        ], 200);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'CityName' => 'required|string|max:255',
        ]);
        $city = CityModel::find($id);
        if (!$city) {
            return response()->json(['error' => 'City not found'], 404);
        }

        $userId = auth()->id();
        $city->CityName = $request->CityName;
        $city->StateID = $request->StateID;
        $city->updated_by = $userId;
        $city->save();
        return response()->json([
            'status' => 'success',
            'message' => 'City updated successfully'
        ], 200);
    }
}
