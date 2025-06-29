<?php

namespace App\Http\Controllers;

use App\Models\BranchModel;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $query = BranchModel::with([
            'city:CityID,CityName',
            'city.areas:AreaID,AreaName,CityID'
        ]);

        if ($search = $request->input('search')) {
            $query->where('BranchName', 'like', "%$search%")
                ->orWhere('ShortName', 'like', "%$search%")
                ->orWhere('ContactPerson', 'like', "%$search%")
                ->orWhere('Mobile', 'like', "%$search%");
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

        $branches = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get([
                'BranchID',
                'BranchName',
                'ShortName',
                'ContactPerson',
                'Mobile',
                'GSTNo'
            ]);

        $formatted = $branches->map(function ($branch) {
            return [
                'BranchID' => $branch->BranchID,
                'BranchName' => $branch->BranchName,
                'ShortName' => $branch->ShortName,
                'ContactPerson' => $branch->ContactPerson,
                'Mobile' => $branch->Mobile,
                'GSTNo' => $branch->GSTNo,
            ];
        });

        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ]);
    }

    public function getAllBranchesList()
    {

        $branches = BranchModel::with([
            'city' => function ($query) {
                $query->select('CityID', 'CityName');
            },
            'city.areas' => function ($query) {
                $query->select('AreaID', 'AreaName', 'CityID');
            }
        ])
            ->get([
                'BranchID',
                'BranchName',
                'ShortName',
                'CityID',
                'City',
                'State',
                'ContactPerson',
                'Mobile',
                'GSTNo'
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Branches fetched successfully.',
            'branches' => $branches,
        ], 200);
    }
    public function getBranchAreas()
    {

        $user = auth()->user();

        $branch = $user->branch;

        if (!$branch) {
            return response()->json([
                'status' => 'error',
                'message' => 'Branch not found for user.'
            ], 404);
        }

        $city = $branch->city;

        if (!$city) {
            return response()->json([
                'status' => 'error',
                'message' => 'City not found for user.'
            ], 404);
        }

        $areas = $city->areas()->select('AreaID', 'AreaName', 'PinCode')->orderBy('AreaName')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Area fetched successfully.',
            'areas' => $areas,
        ]);
    }

    public function getBranchData()
    {
        // this function returns the state, city, areas data of a branch

        $user = auth()->user();

        $branch = $user->branch()->with('city.areas')->first();

        if (!$branch || !$branch->city) {
            return response()->json([
                'status' => 'error',
                'message' => 'Branch or city not found.',
            ], 404);
        }

        $branchData = [
            'BranchID' => $branch->BranchID,
            'BranchName' => $branch->BranchName,
            'State' => $branch->State,
            'CityID' => $branch->city->CityID,
            'CityName' => $branch->city->CityName,
            'Areas' => $branch->city->areas->map(function ($area) {
                return [
                    'AreaID' => $area->AreaID,
                    'AreaName' => $area->AreaName,
                    'PinCode' => $area->PinCode,
                ];
            })->sortBy('AreaName')->values(),
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Branch data fetched successfully !',
            'data' => $branchData,
        ], 200);
    }
    public function store(Request $request)
    {
        $request->validate([
            'BranchName' => 'required|string|max:255',
        ]);

        $incid = BranchModel::max('BranchID') ?? 0;
        $incid = $incid + 1;
        $request['BranchID'] = $incid;
        $imageName = "No.jpg";

        if ($request->hasFile('Picture')) {
            $imageName = "Branch" . '_' . $incid . '.' . $request->Picture->extension();
            $request->Picture->move(public_path('uploadfiles'), $imageName);

            BranchModel::create([
                'BranchID' => $request->input('BranchID'),
                'BranchName' => $request->input('BranchName'),
                'ShortName' => $request->input('ShortName'),
                'Address' => $request->input('Address'),
                'City' => $request->input('City'),
                'CityID' => $request->input('CityID'),
                'State' => $request->input('State'),
                'Country' => $request->input('Country'),
                'PinCode' => $request->input('PinCode'),
                'ContactPerson' => $request->input('ContactPerson'),
                'Mobile' => $request->input('Mobile'),
                'Email' => $request->input('Email'),
                'Picture' => $imageName,
                'GSTNo' => $request->input('GSTNo'),
            ]);
        } else {
            BranchModel::create([
                'BranchID' => $request->input('BranchID'),
                'BranchName' => $request->input('BranchName'),
                'ShortName' => $request->input('ShortName'),
                'Address' => $request->input('Address'),
                'City' => $request->input('City'),
                'CityID' => $request->input('CityID'),
                'State' => $request->input('State'),
                'Country' => $request->input('Country'),
                'PinCode' => $request->input('PinCode'),
                'ContactPerson' => $request->input('ContactPerson'),
                'Mobile' => $request->input('Mobile'),
                'Email' => $request->input('Email'),
                'Picture' => $imageName,
                'GSTNo' => $request->input('GSTNo'),
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Branch created successfully.',
        ]);
    }
    public function show($id)
    {

        $branch = BranchModel::with([
            'city' => function ($query) {
                $query->select('CityID', 'CityName');
            },
            'city.areas' => function ($query) {
                $query->select('AreaID', 'AreaName', 'CityID');
            }
        ])
            ->where('BranchID', $id)
            ->get([
                'BranchID',
                'BranchName',
                'ShortName',
                'CityID',
                'City',
                'State',
                'ContactPerson',
                'Mobile',
                'GSTNo',
                'Address',
                'PinCode',
                'Mobile',
                'Email',
                'Picture'
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Branch fetched successfully.',
            'branch' => $branch,
        ], 200);
    }
    public function destroy($id)
    {
        BranchModel::find($id)->delete();
        return response()->json(['message' => 'Branch deleted successfully!'], 201);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'BranchID' => 'required|integer',
            'BranchName' => 'required|string|max:255',
        ]);
        if ($request->hasFile('Picture')) {
            $imageName = "Branch" . '_' . $request->BranchID . '.' . $request->Picture->extension();
            $request->Picture->move(public_path('uploadfiles'), $imageName);

            $product = BranchModel::find($id);
            $product->update([
                'BranchID' => $request->input('BranchID'),
                'BranchName' => $request->input('BranchName'),
                'ShortName' => $request->input('ShortName'),
                'Address' => $request->input('Address'),
                'City' => $request->input('City'),
                'CityID' => $request->input('CityID'),
                'State' => $request->input('State'),
                'Country' => $request->input('Country'),
                'PinCode' => $request->input('PinCode'),
                'ContactPerson' => $request->input('ContactPerson'),
                'Mobile' => $request->input('Mobile'),
                'Email' => $request->input('Email'),
                'Picture' => $imageName,
                'GSTNo' => $request->input('GSTNo'),
            ]);
        } else {
            $product = BranchModel::find($id);
            $product->update([
                'BranchID' => $request->input('BranchID'),
                'BranchName' => $request->input('BranchName'),
                'ShortName' => $request->input('ShortName'),
                'Address' => $request->input('Address'),
                'City' => $request->input('City'),
                'CityID' => $request->input('CityID'),
                'State' => $request->input('State'),
                'Country' => $request->input('Country'),
                'PinCode' => $request->input('PinCode'),
                'ContactPerson' => $request->input('ContactPerson'),
                'Mobile' => $request->input('Mobile'),
                'Email' => $request->input('Email'),
                'GSTNo' => $request->input('GSTNo'),
            ]);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Branch updated successfully.',
        ]);
    }
    public function showAllBranches()
    {
        $branches = BranchModel::select('BranchID', 'BranchName')->get();
        return response()->json($branches);
    }
}
