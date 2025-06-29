<?php

namespace App\Http\Controllers;

use App\Models\BranchModel;
use App\Models\GroupModel;
use App\Models\OrderModel;
use App\Models\PurchaseTransModel;
use App\Models\RoleModel;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Request;
use App\Models\ProductModel;
use App\Models\UnitModel;
use App\Models\PackSizeModel;
use App\Models\CategoryModel;
use App\Models\PackingMaterialModel;
use App\Models\BranchPriceModel;
use App\Models\OrderTransModel;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use function Laravel\Prompts\select;
use function PHPUnit\Framework\returnArgument;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductModel::with([
            'unit:UnitID,UnitName',
            'category:CategoryID,CategoryName',
            'packsize:PackSizeID,PackSizeName'
        ]);

        if ($search = $request->input('search')) {
            $query->where('ProductName', 'like', "%$search%");
        }

        if ($sortField = $request->input('sortField')) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();

        $products = $query->skip(($request->page - 1) * $request->limit)
            ->take($request->limit)
            ->get();

        $formatted = $products->map(fn($p) => [
            'ProductID' => $p->ProductID,
            'ProductName' => $p->ProductName,
            'ProductUnicodeName' => $p->ProductUnicodeName,
            'ItemCodeBlinkit' => $p->ItemCodeBlinkit,
            'ItemCodeSwiggy' => $p->ItemCodeSwiggy,
            'ItemCodeRelience' => $p->ItemCodeRelience,
            'UnitName' => $p->unit->UnitName ?? '',
            'CategoryName' => $p->category->CategoryName ?? '',
            'PackSizeName' => $p->packsize->PackSizeName ?? '',
            'NameBlinkit' => $p->NameBlinkit,
            'NameSwiggy' => $p->NameSwiggy,
            'NameRelience' => $p->NameRelience
        ]);

        return response()->json([
            'data' => $formatted,
            'total' => $total,
        ]);
    }

    // products returns products with customer prices for a branch. If not logged in, customer prices are shown to everyone
    public function products(Request $request, $branchid)
    {

        $branchId = (int) $branchid;

        $branchExists = BranchModel::where('BranchID', $branchId)->exists();

        if (!$branchExists) {
            return response()->json([
                'error' => 'Branch not found.'
            ], 404);
        }

        $products = ProductModel::with([
            'unit:UnitID,UnitName',
            'category:CategoryID,CategoryName',
            'branchprices' => function ($query) use ($branchId) {
                $query->where('BranchID', $branchId)
                    ->where('IsEnable', true)
                    ->select('BranchPriceID', 'ProductID', 'BranchID', 'CustomerPrice');
            }
        ])
            ->whereHas('branchprices', function ($query) use ($branchId) {
                $query->where('BranchID', $branchId)
                    ->where('IsEnable', true);
            })
            ->get();

        $productList = $products->map(function ($product) {
            return [
                'Picture' => $product->Picture ? url('uploadfiles/' . $product->Picture) : null,
                'ProductID' => $product->ProductID,
                'ProductName' => $product->ProductName,
                'ProductUnicodeName' => $product->ProductUnicodeName,
                'ProductHindiName' => $product->ProductHindiName,
                'UnitName' => $product->unit->UnitName,
                'CategoryName' => $product->category->CategoryName,
                'Price' => $product->branchprices->first()->CustomerPrice,
            ];
        });

        return response()->json($productList);
    }

    // userProducts returns products with respective prices for a specific user
    public function userProducts(Request $request)
    {

        $user = auth()->user();

        $branchId = $user->BranchID;
        $roleId = $user->RoleID;

        $role = RoleModel::where("RoleID", $roleId)->value('RoleName');

        $rolePrice = [
            'Customer' => 'CustomerPrice',
            'Institution' => 'InstitutionPrice',
            'NewInstitution' => 'NewInstitutionPrice',
        ];

        $priceType = $rolePrice[$role] ?? 'CustomerPrice';

        $productsQuery = ProductModel::with([
            'unit',
            'category',
            'packsize',
            'branchprices' => function ($query) use ($branchId) {
                $query->where('BranchID', $branchId)
                    ->where('IsEnable', true);
            }
        ])
            ->whereHas('branchprices', function ($query) use ($branchId) {
                $query->where('BranchID', $branchId)
                    ->where('IsEnable', true);
                ;
            });

        if ($role === 'Institution') {
            $productsQuery->whereHas('packsize', function ($query) {
                $query->where('Facter', 1);
            });
        }

        $products = $productsQuery->get();

        $productList = $products->map(function ($product) use ($priceType) {
            $branchPrice = $product->branchprices->first();

            $price = $branchPrice ? $branchPrice->$priceType : null;

            if (!$price || $price == 0) {
                return null;
            }

            return [
                'Picture' => $product->Picture ? url('uploadfiles/' . $product->Picture) : null,
                'ProductID' => $product->ProductID,
                'ProductName' => $product->ProductName,
                'ProductUnicodeName' => $product->ProductUnicodeName,
                'ProductHindiName' => $product->ProductHindiName,
                'UnitName' => $product->unit->UnitName,
                'CategoryName' => $product->category->CategoryName,
                'Price' => $price,
            ];
        })
            ->filter() // remove null
            ->sortBy('ProductName')
            ->values();

        return response()->json($productList);
    }

    public function store(Request $request)
    {

        try {
            $validated = $request->validate([
                'ProductName' => 'required|string|max:255|unique:ProductModels,ProductName',
                'ProductUnicodeName' => 'required|string|max:255',
                'ProductHindiName' => 'required|string|max:255',
                'UnitID' => 'required|integer|exists:UnitModels,UnitID',
                'GroupID' => 'required|integer|exists:GroupModels,GroupID',
                'PackSizeID' => 'required|integer|exists:PackSizeModels,PackSizeID',
                'CategoryID' => 'required|integer|exists:CategoryModels,CategoryID',
                'PackingMaterialID' => 'required|integer|exists:PackingMaterialModels,PackingMaterialID',
                'ItemCodeSwiggy' => 'nullable|string|max:255',
                'NameSwiggy' => 'nullable|string|max:255',
                'StorageSwiggy' => 'nullable|string|max:255',
                'ShelfLifeSwiggy' => 'nullable|integer|max:255',
                'UOMSwiggy' => 'nullable|string|max:255',
                'ItemCodeBlinkit' => 'nullable|string|max:255',
                'NameBlinkit' => 'nullable|string|max:255',
                'UOMBlinkit' => 'nullable|string|max:255',
                'ItemCodeRelience' => 'nullable|string|max:255',
                'NameRelience' => 'nullable|string|max:255',
                'UOMRelience' => 'nullable|string|max:255',
                'MinOrderQty' => 'required|numeric',
                'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',

            ]);

            $userId = auth()->id();
            $incid = ProductModel::max('ProductID') ?? 0;
            $incid = $incid + 1;

            $imageName = "No.jpg";
            if ($request->hasFile('Picture')) {
                $image = $request->file('Picture');
                $imageName = 'Product_' . $incid . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploadfiles'), $imageName);
            }

            ProductModel::create([
                'ProductID' => $incid,
                ...$validated,
                'Picture' => $imageName,
                'created_by' => $userId,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Product created successfully',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function show($id)
    {
        $product = ProductModel::with(['unit', 'category', 'packsize', 'packingMaterial', 'group'])->find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'product' => $product,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        try {

            $product = ProductModel::findOrFail($id);

            $validated = $request->validate([
                'ProductName' => 'required|string|max:255',
                'ProductUnicodeName' => 'required|string|max:255',
                'ProductHindiName' => 'required|string|max:255',
                'UnitID' => 'required|integer|exists:UnitModels,UnitID',
                'GroupID' => 'required|integer|exists:GroupModels,GroupID',
                'PackSizeID' => 'required|integer|exists:PackSizeModels,PackSizeID',
                'CategoryID' => 'required|integer|exists:CategoryModels,CategoryID',
                'PackingMaterialID' => 'required|integer|exists:PackingMaterialModels,PackingMaterialID',
                'ItemCodeSwiggy' => 'nullable|string|max:255',
                'NameSwiggy' => 'nullable|string|max:255',
                'StorageSwiggy' => 'nullable|string|max:255',
                'ShelfLifeSwiggy' => 'nullable|integer|max:255',
                'UOMSwiggy' => 'nullable|string|max:255',
                'ItemCodeBlinkit' => 'nullable|string|max:255',
                'NameBlinkit' => 'nullable|string|max:255',
                'UOMBlinkit' => 'nullable|string|max:255',
                'ItemCodeRelience' => 'nullable|string|max:255',
                'NameRelience' => 'nullable|string|max:255',
                'UOMRelience' => 'nullable|string|max:255',
                'MinOrderQty' => 'required|numeric',
                'Picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',

            ]);

            $userId = auth()->id();

            $imageName = $product->Picture;

            if ($request->hasFile('Picture')) {

                if ($product->Picture !== 'No.jpg' && file_exists(public_path('uploadfiles/' . $product->Picture))) {
                    unlink(public_path('uploadfiles/' . $product->Picture));
                }

                $image = $request->file('Picture');
                $imageName = 'Product_' . $product->ProductID . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploadfiles'), $imageName);
            }

            $product->update([
                ...$validated,
                'Picture' => $imageName,
                'updated_by' => $userId,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Product updated successfully',
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $product = ProductModel::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        $isUsedInOrders = OrderTransModel::where('ProductID', $id)->exists();
        $isUSedInPurchase = PurchaseTransModel::where('ProductID', $id)->exists();

        if ($isUsedInOrders || $isUSedInPurchase) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product is used in orders or purchase and cannot be deleted.',
            ], 403);
        }


        if ($product->Picture && $product->Picture !== 'No.jpg') {
            $imagePath = public_path('uploadfiles/' . $product->Picture);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully.'
        ]);
    }
}
