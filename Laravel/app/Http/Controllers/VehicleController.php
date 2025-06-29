<?php

namespace App\Http\Controllers;

use App\Models\VehicleModel;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = VehicleModel::query();
        if ($search = $request->input('search')) {
            $query->where('VehicleName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $vehicles = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $vehicles->map(function ($vehicle) {
            return [
                'VehicleID' => $vehicle->VehicleID,
                'VehicleName' => $vehicle->VehicleName,
                'VehicleNumber' => $vehicle->VehicleNumber,
                'VehicleType' => $vehicle->VehicleType,
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
            'VehicleName' => 'required|string|max:255',
            'VehicleNumber' => 'required|string|max:255',
            'Make' => 'required|string|max:255',
            'Model' => 'required|string|max:255',
            'YearofManufacture' => 'required|string|max:255',
            'VehicleType' => 'nullable|string|max:255',
            'RegistrationNumber' => 'required|string|max:255',
            'EngineType' => 'nullable|string|max:255',
            'EngineCapacity' => 'nullable|string|max:255',
            'Mileage' => 'nullable|string|max:255',
            'FuelCapacity' => 'nullable|string|max:255',
        ]);

        $userId = auth()->id();

        $maxId = VehicleModel::max('VehicleID') ?? 0;
        $newId = $maxId + 1;

        VehicleModel::create([
            'VehicleID' => $newId,
            'VehicleName' => $validated['VehicleName'],
            'VehicleNumber' => $validated['VehicleNumber'],
            'Make' => $validated['Make'],
            'Model' => $validated['Model'],
            'YearofManufacture' => $validated['YearofManufacture'],
            'VehicleType' => $validated['VehicleType'] ?? '',
            'RegistrationNumber' => $validated['RegistrationNumber'],
            'EngineType' => $validated['EngineType'] ?? '',
            'EngineCapacity' => $validated['EngineCapacity'] ?? '',
            'Mileage' => $validated['Mileage'] ?? '',
            'FuelCapacity' => $validated['FuelCapacity'] ?? '',
            'created_by' => $userId,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle created successfully.',
        ], 201);
    }
    public function show($id)
    {
        $vehicle = VehicleModel::find($id);
        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }
        return response()->json($vehicle, 200);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'VehicleName' => 'required|string',
            'VehicleNumber' => 'required|string',
            'Make' => 'required|string',
            'Model' => 'required|string',
            'YearofManufacture' => 'required|string',
            'VehicleType' => 'nullable|string',
            'RegistrationNumber' => 'required|string',
            'EngineType' => 'nullable|string',
            'EngineCapacity' => 'nullable|string',
            'Mileage' => 'nullable|string',
            'FuelCapacity' => 'nullable|string',
        ]);
        $userId = auth()->id();
        $vehicle = VehicleModel::find($id);
        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }
        $vehicle->VehicleName = $request->VehicleName;
        $vehicle->VehicleNumber = $request->VehicleNumber;
        $vehicle->Make = $request->Make;
        $vehicle->Model = $request->Model;
        $vehicle->YearofManufacture = $request->YearofManufacture;
        $vehicle->VehicleType = $request->VehicleType;
        $vehicle->RegistrationNumber = $request->RegistrationNumber;
        $vehicle->EngineType = $request->EngineType;
        $vehicle->EngineCapacity = $request->EngineCapacity;
        $vehicle->Mileage = $request->Mileage;
        $vehicle->FuelCapacity = $request->FuelCapacity;
        $vehicle->updated_by = $userId;
        $vehicle->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $vehicle = VehicleModel::find($id);
        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }
        $vehicle->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle deleted successfully'
        ], 200);
    }
}
