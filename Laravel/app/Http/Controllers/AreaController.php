<?php

namespace App\Http\Controllers;

use App\Models\AreaModel;
use App\Models\CityModel;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    public function index(Request $request)
    {
        $query = AreaModel::with(['city:CityID,CityName']);

        if ($search = $request->input('search')) {
            $query->where('AreaName', 'like', "%$search%");
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

        $areas = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();

        $formatted = $areas->map(function ($area) {
            return [
                'AreaID' => $area->AreaID,
                'AreaName' => $area->AreaName,
                'CityName' => $area->city->CityName ?? '',
                'PinCode' => $area->PinCode
            ];
        });

        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'AreaName' => 'required|string|max:255',
        ]);
        $incid = AreaModel::max('AreaID') ?? 0;
        $incid++;

        $userId = auth()->id();

        $data = $request->all();
        $data['AreaID'] = $incid;
        $data['created_by'] = $userId;

        AreaModel::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Area created successfully',
        ], 201);
    }
    public function show($id)
    {
        $area = AreaModel::with(['city:CityID,CityName'])->find($id);
        return response()->json($area);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'AreaName' => 'required|string|max:255',
        ]);
        $area = AreaModel::find($id);

        if (!$area) {
            return response()->json(['error' => 'Area not found.'], 404);
        }

        $userId = auth()->id();
        $area->AreaName = $request->AreaName;
        $area->CityID = $request->CityID;
        $area->PinCode = $request->Pincode;
        $area->updated_by = $userId;
        $area->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Area updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $area = AreaModel::find($id);
        if (!$area) {
            return response()->json(['error' => 'Area not found.'], 404);
        }
        $area->delete();
        return response()->json(['message' => 'Area deleted successfully']);
    }
}
