<?php

namespace App\Http\Controllers;

use App\Models\CategoryModel;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = CategoryModel::query();
        if ($search = $request->input('search')) {
            $query->where('CategoryName', 'like', "%$search%");
        }
        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }
        $total = $query->count();
        $categories = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();
        $formatted = $categories->map(function ($category) {
            return [
                'CategoryID' => $category->CategoryID,
                'CategoryName' => $category->CategoryName,
                'Remark' => $category->Remark ?? '',
                'PercentageMargin' => $category->PercentageMargin,
                'SortingLossPercentage' => $category->SortingLossPercentage,
                'WeightLossPercentage' => $category->WeightLossPercentage,
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
            'CategoryName' => 'required|string|max:255',
            'Remark' => 'nullable|string|max:1000',
            'PercentageMargin' => 'required|numeric|min:0',
            'SortingLossPercentage' => 'required|numeric|min:0',
            'WeightLossPercentage' => 'required|numeric|min:0',
        ]);
        $incid = CategoryModel::max('CategoryID') ?? 0;
        $incid += 1;
        $userId = auth()->id();
        $request['CategoryID'] = $incid;
        $request['created_by'] = $userId;
        CategoryModel::create($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully!'
        ], 201);
    }
    public function show($id)
    {
        return response()->json(CategoryModel::find($id));
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'CategoryName' => 'required|string|max:255',
            'Remark' => 'nullable|string|max:1000',
            'PercentageMargin' => 'required|numeric|min:0',
            'SortingLossPercentage' => 'required|numeric|min:0',
            'WeightLossPercentage' => 'required|numeric|min:0',
        ]);

        $userId = auth()->id();
        $request['updated_by'] = $userId;
        $category = CategoryModel::find($id);
        $category->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Category updated successfully'
        ], 200);
    }
    public function destroy($id)
    {
        $category = CategoryModel::find($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
