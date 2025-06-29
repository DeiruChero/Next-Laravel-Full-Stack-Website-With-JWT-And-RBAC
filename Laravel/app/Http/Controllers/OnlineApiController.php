<?php
namespace App\Http\Controllers\WebsiteApi;
use App\Http\Controllers\Controller;
use App\Models\InstitutionModel;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use App\Models\ProductModel;
use App\Models\ProductView;
use App\Models\BranchModel;
use App\Models\AreaModel;
use App\Models\CityModel;
use App\Models\UserModel;
use App\Models\BranchView;

class OnlineApiController extends Controller
{
    public function GetBranchList(Request $request)
    {
        $branches = BranchModel::select('BranchID', 'BranchName')->get();

        $branchList = $branches->map(function ($branch) {
            $obj = new BranchView((string) $branch->BranchID, $branch->BranchName);
            $obj->Key = Crypt::encryptString($obj->Key);
            return $obj;
        });

        return response()->json($branchList);
    }
    // Set Branch ID
    public function SetBranchLocation(Request $request)
    {
        $branchid = $request->input('branchid');
        // decrypt the branch id
        $branchid = Crypt::decryptString($branchid);
        $branch = BranchModel::where('BranchID', $branchid)->first();
        // set cookies here
        // Cookie ::queue('bid', $branchid, 3600);
        return response()->json([
            'branchName' => $branch->BranchName,
            'result' => 'Y',
        ]);
    }

    //Get Area List
    public function GetAreaList(Request $request)
    {
        $uid = $request->input('uid');
        $bid = $request->input('branchid');

        if ($uid) {
            $userid = Crypt::decryptString($uid);

            $branch = UserModel::join('BranchModels', 'UserModels.BranchID', '=', "BranchModels.BranchID")
                ->where('UserModels.UserID', $userid)
                ->select('BranchModels.CityID')->first();

            if (!$branch) {
                return response()->json(['error' => 'Branch not found'], 404);
            }

            $cityId = $branch->CityID;
        } elseif ($bid) {
            $branchid = Crypt::decryptString($bid);
            $branch = BranchModel::where('BranchID', $branchid)
                ->select('CityID')
                ->first();

            if (!$branch) {
                return response()->json(['error' => 'Branch not found'], 404);
            }

            $cityId = $branch->CityID;
        } else {
            return response()->json(['error' => 'Invalid parameters'], 400);
        }



        $area = AreaModel::where('CityID', $cityId)
            ->select('AreaID', 'AreaName', 'PinCode')
            ->orderBy('AreaName', 'asc')
            ->get();

        $encodedData = base64_encode($area->toJson());


        return response()->json(['data' => $encodedData]);
    }

    // Get Product List 
    public function GetProductList(Request $request)
    {
        $branchid = "No";
        $userid = "No";
        $usertype = "No";

        $bid = $request->input('branchid');
        $uid = $request->input('userid');

        if ($bid !== "No") {
            $branchid = Crypt::decryptString($bid);
        }
        if ($uid !== "No") {
            $userid = Crypt::decryptString($uid);
            $user = UserModel::where('UserID', $userid)->first();
            $usertype = $user->UserType; // select 
            $branchid = $user->BranchID; // override
        }


        if ($branchid == "No") {
            $query = ProductModel::query()
                ->join('BranchPriceModels', 'ProductModels.ProductID', '=', 'BranchPriceModels.ProductID')
                ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
                ->where('BranchPriceModels.BranchID', '1')
                ->where('BranchPriceModels.IsEnable', '=', true)
                ->where('BranchPriceModels.CustomerPrice', '!=', 0)
                ->select('ProductModels.*', \DB::raw('0 as "Quantity"'), 'BranchPriceModels.CustomerPrice as Price', 'UnitModels.UnitName')
                ->take(10)
                ->get();
            //
            $productList = $query->map(function ($q) {
                $obj = new ProductView(
                    $q->ProductID,
                    $q->CategoryID,
                    $q->ProductName,
                    $q->ProductHindiName,
                    $q->ProductUnicodeName,
                    $q->UnitName,
                    (int) $q->Quantity,
                    (float) $q->Price,
                    $q->Picture
                );
                return $obj;
            });
            $encodedData = base64_encode($productList->toJson());
            // return response()->json($productList);
            return response()->json(['data' => $encodedData]);

        } else {
            switch ($usertype) {
                case 'Institution':

                    $institutionModel = InstitutionModel::where('UserID', $userid)->first();

                    $price = $institutionModel->PriceType === 'NewInstitution' ? 'NewInstitutionPrice' : 'InstitutionPrice';

                    //  $subQuery = ProductModel::select('GroupID', \DB::raw('MIN("ProductID") as "ProductID" '))
                    //  ->groupBy('GroupID');

                    $subQuery = \DB::table(\DB::raw('"ProductModels"'))
                        ->join(\DB::raw('"BranchPriceModels"'), \DB::raw('"ProductModels"."ProductID"'), '=', \DB::raw('"BranchPriceModels"."ProductID"'))
                        ->whereRaw('"BranchPriceModels"."BranchID" = ?', [$branchid])
                        ->whereRaw('"BranchPriceModels"."IsEnable" = true')
                        ->groupBy(\DB::raw('"ProductModels"."GroupID"'))
                        ->select(
                            \DB::raw('"ProductModels"."GroupID"'),
                            \DB::raw('MIN("ProductModels"."ProductID") as "ProductID"')
                        );

                    $query = ProductModel::query()
                        ->joinSub($subQuery, 'Sub', function ($join) {
                            $join->on('ProductModels.ProductID', '=', 'Sub.ProductID');
                        })
                        ->join('BranchPriceModels', 'ProductModels.ProductID', '=', 'BranchPriceModels.ProductID')
                        ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
                        ->leftJoin('PackSizeModels', 'ProductModels.PackSizeID', '=', 'PackSizeModels.PackSizeID')
                        ->where('BranchPriceModels.BranchID', $branchid)
                        ->where('BranchPriceModels.IsEnable', '=', true)
                        ->whereRaw('"BranchPriceModels"."' . $price . '" != 0')
                        ->select(
                            'ProductModels.*',
                            \DB::raw('0 as "Quantity"'),
                            \DB::raw('"BranchPriceModels"."' . $price . '" as "Price"'),
                            'UnitModels.UnitName',
                            'PackSizeModels.Facter'
                        )
                        ->get();  // return only one product associated with a group id, only for institutions

                    $productList = $query->map(function ($q) {
                        $obj = new ProductView(
                            $q->ProductID,
                            $q->CategoryID,
                            $q->ProductName,
                            $q->ProductHindiName,
                            $q->ProductUnicodeName,
                            $q->UnitName,
                            (int) $q->Quantity,
                            (float) $q->Price,
                            $q->Picture,
                            $q->Facter,
                        );
                        return $obj;

                    });
                    // return response()->json($productList);
                    $encodedData = base64_encode($productList->toJson());
                    return response()->json(['data' => $encodedData, 'ut' => $usertype]);

                case 'Customer':
                    $query = ProductModel::query()
                        ->join('BranchPriceModels', 'ProductModels.ProductID', '=', 'BranchPriceModels.ProductID')
                        ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
                        ->where('BranchPriceModels.BranchID', $branchid)
                        ->where('BranchPriceModels.IsEnable', '=', true)
                        ->where('BranchPriceModels.CustomerPrice', '!=', 0)
                        ->select('ProductModels.*', \DB::raw('0 as "Quantity"'), 'BranchPriceModels.CustomerPrice as Price', 'UnitModels.UnitName')
                        ->get();
                    //
                    $productList = $query->map(function ($q) {
                        $obj = new ProductView(
                            $q->ProductID,
                            $q->CategoryID,
                            $q->ProductName,
                            $q->ProductHindiName,
                            $q->ProductUnicodeName,
                            $q->UnitName,
                            (int) $q->Quantity,
                            (float) $q->Price,
                            $q->Picture
                        );
                        return $obj;
                    });
                    // return response()->json($productList);

                    $encodedData = base64_encode($productList->toJson());
                    return response()->json(['data' => $encodedData]);

                case 'Admin':
                    $query = ProductModel::query()
                        ->join('BranchPriceModels', 'ProductModels.ProductID', '=', 'BranchPriceModels.ProductID')
                        ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
                        ->where('BranchPriceModels.BranchID', $branchid)
                        ->where('BranchPriceModels.IsEnable', '=', true)
                        ->where('BranchPriceModels.CustomerPrice', '!=', 0)
                        ->select('ProductModels.*', \DB::raw('0 as "Quantity"'), 'BranchPriceModels.CustomerPrice as Price', 'UnitModels.UnitName')
                        ->get();
                    //
                    $productList = $query->map(function ($q) {
                        $obj = new ProductView(
                            $q->ProductID,
                            $q->CategoryID,
                            $q->ProductName,
                            $q->ProductHindiName,
                            $q->ProductUnicodeName,
                            $q->UnitName,
                            (int) $q->Quantity,
                            (float) $q->Price,
                            $q->Picture
                        );
                        return $obj;
                    });
                    // return response()->json($productList);
                    $encodedData = base64_encode($productList->toJson());
                    return response()->json(['data' => $encodedData]);

                case 'ShopManager':
                    $query = ProductModel::query()
                        ->join('BranchPriceModels', 'ProductModels.ProductID', '=', 'BranchPriceModels.ProductID')
                        ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
                        ->where('BranchPriceModels.BranchID', $branchid)
                        ->where('BranchPriceModels.IsEnable', '=', true)
                        ->where('BranchPriceModels.CustomerPrice', '!=', 0)
                        ->select('ProductModels.*', \DB::raw('0 as "Quantity"'), 'BranchPriceModels.CustomerPrice as Price', 'UnitModels.UnitName')
                        ->get();

                    $productList = $query->map(function ($q) {
                        $obj = new ProductView(
                            $q->ProductID,
                            $q->CategoryID,
                            $q->ProductName,
                            $q->ProductHindiName,
                            $q->ProductUnicodeName,
                            $q->UnitName,
                            (int) $q->Quantity,
                            (float) $q->Price,
                            $q->Picture
                        );
                        return $obj;
                    });
                    // return response()->json($productList);
                    $encodedData = base64_encode($productList->toJson());
                    return response()->json(['data' => $encodedData]);

                case 'Distributor':
                    $query = ProductModel::query()
                        ->join('BranchPriceModels', 'ProductModels.ProductID', '=', 'BranchPriceModels.ProductID')
                        ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
                        ->where('BranchPriceModels.BranchID', $branchid)
                        ->where('BranchPriceModels.IsEnable', '=', true)
                        ->where('BranchPriceModels.CustomerPrice', '!=', 0)
                        ->select('ProductModels.*', \DB::raw('0 as "Quantity"'), 'BranchPriceModels.CustomerPrice as Price', 'UnitModels.UnitName')
                        ->get();
                    //
                    $productList = $query->map(function ($q) {
                        $obj = new ProductView(
                            $q->ProductID,
                            $q->CategoryID,
                            $q->ProductName,
                            $q->ProductHindiName,
                            $q->ProductUnicodeName,
                            $q->UnitName,
                            (int) $q->Quantity,
                            (float) $q->Price,
                            $q->Picture
                        );
                        return $obj;
                    });
                    // return response()->json($productList); 
                    $encodedData = base64_encode($productList->toJson());
                    return response()->json(['data' => $encodedData]);

                //   return response()->json($query);
                default:   // default case            
                    $query = ProductModel::query()
                        ->join('BranchPriceModels', 'ProductModels.ProductID', '=', 'BranchPriceModels.ProductID')
                        ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
                        ->where('BranchPriceModels.BranchID', $branchid)
                        ->where('BranchPriceModels.IsEnable', '=', true)
                        ->where('BranchPriceModels.CustomerPrice', '!=', 0)
                        ->select('ProductModels.*', \DB::raw('0 as "Quantity"'), 'BranchPriceModels.CustomerPrice as Price', 'UnitModels.UnitName')
                        ->get();
                    $productList = $query->map(function ($q) {
                        $obj = new ProductView(
                            $q->ProductID,
                            $q->CategoryID,
                            $q->ProductName,
                            $q->ProductHindiName,
                            $q->ProductUnicodeName,
                            $q->UnitName,
                            (int) $q->Quantity,
                            (float) $q->Price,
                            $q->Picture
                        );
                        return $obj;
                    });
                    // return response()->json($productList);
                    $encodedData = base64_encode($productList->toJson());
                    return response()->json(['data' => $encodedData]);

            }
        }

    }
    public function SetUpdatedPrice(Request $request)
    {

        $request->validate([
            'userid' => 'required|string',
            'branchid' => 'required|string',
        ]);

        $userid = $request['userid'];
        $branchid = $request['branchid'];
        $itemsList = $request['itemsList'];

        // $itemsList = $request['itemsList']; 

        $userid = Crypt::decryptString($userid);
        $branchid = Crypt::decryptString($branchid);
        // $userid = 1;
        // $branchid = 1;

        $user = UserModel::where('UserID', $userid)->first();
        $usertype = $user->UserType;
        // $usertype = "Institution";
        $priceselector = "";

        switch ($usertype) {
            case "Admin":
                $priceselector = "EmployeePrice";
                break;
            case "ShopManager":
                $priceselector = "EmployeePrice";
                break;
            case "Institution":
                $priceselector = "InstitutionPrice";
                break;
            case "Customer":
                $priceselector = "CustomerPrice";
                break;
        }

        // Update each item's price in the items list
        foreach ($itemsList as &$item) {  // Use &$item to modify the original array
            $item['Price'] = $this->GetPrice($item['Key'], $branchid, $priceselector);
        }
        unset($item);  // Break reference with the last element

        return response()->json([
            'updatedItemsList' => $itemsList,
            'result' => 'Y'
        ]);

    }
    public function GetPrice($productID, $branchID, $priceSelector)
    {
        $allowedColumns = ['EmployeePrice', 'CustomerPrice', 'InstitutionPrice']; // List valid column names here
        if (!in_array($priceSelector, $allowedColumns)) {
            return response()->json(['error' => 'Invalid price selector'], 400);
        }
        $query = "SELECT \"{$priceSelector}\" FROM \"BranchPriceModels\" WHERE \"ProductID\" = ? AND \"BranchID\" = ?";
        $priceResult = DB::select($query, [$productID, $branchID]);
        return !empty($priceResult) ? $priceResult[0]->$priceSelector : null;
    }

}
