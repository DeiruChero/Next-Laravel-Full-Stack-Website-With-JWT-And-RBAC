<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductModel;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;
use App\Models\OrderModel;
use App\Models\OrderTransModel;
use App\Models\UserModel;
use App\Models\BranchPriceModel;
use App\Models\InstitutionModel;
use Lcobucci\JWT\Validation\Constraint\ValidAt;
use phpDocumentor\Reflection\Types\Integer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClientOrderController extends Controller
{

  
    public function GetOrderList(Request $request)
    {
        $userid = $request['uid'];
        $userid = Crypt::decryptString($userid);
        $orderlist = OrderModel::where('ClientID', $userid)
            ->select('OrderID', 'OrderNo', 'OrderDate', 'TotalAmount', 'OrderStatus', 'PaymentMode', 'PaymentStatus')
            ->orderBy('OrderID', 'desc')
            ->paginate(10);  // Paginate with 10 records per page

        $encodedData = base64_encode($orderlist->toJson());
        return response()->json(['data' => $encodedData]);
    }
    public function GetOrderDetails(Request $request)
    {
        $orderid = $request['orderid'];
        $order = OrderModel::where('OrderID', $orderid)
            ->select('OrderID', 'OrderNo', 'OrderDate', 'TotalAmount', 'OrderStatus')
            ->first();

        $itemslist = OrderTransModel::where('OrderID', $orderid)
            ->join('ProductModels', 'OrderTransModels.ProductID', '=', 'ProductModels.ProductID')
            ->join('UnitModels', 'ProductModels.UnitID', '=', 'UnitModels.UnitID')
            ->leftJoin('PackSizeModels', 'ProductModels.PackSizeID', '=', 'PackSizeModels.PackSizeID')

            ->select('ProductModels.ProductID', 'ProductModels.ProductName', 'ProductModels.ProductUnicodeName', 'UnitModels.UnitName', 'OrderTransModels.Quantity', 'OrderTransModels.Rate', 'OrderTransModels.Amount', 'PackSizeModels.Facter')
            ->get();

        $data = ['order' => $order, 'itemslist' => $itemslist];

        $encodedData = base64_encode(json_encode($data));

        return response()->json(['data' => $encodedData]);
    }
    public function GetReorderItemsData(Request $request)
    {

        $validatedData = $request->validate([
            'orderid' => ['required', 'integer'],
            'uid' => ['required'],
        ]);

        $user = $validatedData['uid'];
        $userid = Crypt::decryptString($user);

        $user = UserModel::where('UserID', $userid)->firstOrFail();
        $usertype = $user->UserType;
        $branchid = $user->BranchID;
        $orderid = $validatedData['orderid'];

        $products = OrderTransModel::where('OrderID', $orderid)
            ->select('ProductID', 'Quantity')
            ->get()
            ->keyBy('ProductID');

        $productids = $products->keys()->toArray(); // get only product ids in an array

        $query = ProductModel::join('BranchPriceModels as bp', 'ProductModels.ProductID', '=', 'bp.ProductID')
            ->join('UnitModels as u', 'ProductModels.UnitID', '=', 'u.UnitID')
            ->join('PackSizeModels as ps', 'ProductModels.PackSizeID', '=', 'ps.PackSizeID')
            ->where('bp.BranchID', $branchid)
            ->where('bp.IsEnable', '=', true)
            ->whereIn('ProductModels.ProductID', $productids)
            ->select(
                'ProductModels.ProductID',
                'ProductModels.ProductName',
                'ProductModels.ProductUnicodeName',
                'ProductModels.Picture',
                'u.UnitName',
                'ps.Facter',
            );

        if ($usertype === 'Institution') {
            $instiModel = InstitutionModel::where('UserID', $userid)->first();
            $pricetype = $instiModel->PriceType === 'NewInstitution' ? 'NewInstitutionPrice' : 'InstitutionPrice';

            $query->addSelect(DB::raw("bp.\"$pricetype\" as Price"));

        } else if ($usertype === 'Customer') {
            $query->addSelect('bp.CustomerPrice as price');
        }

        $orderedList = $query->get();

        // adding qty to each product
        $orderedList = $orderedList->map(function ($item) use ($products) {
            $item->Qty = $products[$item->ProductID]->Quantity;
            return $item;
        });

        $encodedData = base64_encode($orderedList->toJson());
        return response()->json(['data' => $encodedData, 'ut' => $usertype]);

    }
    public function GetEncrypted(Request $request)
    {
        $list = json_decode($request->input('value'), true);
        $subtotal = Crypt::encryptString($list[0]);
        $deliveryCharge = Crypt::encryptString($list[1]);
        $totalAmount = Crypt::encryptString($list[2]);
        return response()->json([
            'subTotal' => $subtotal,
            'deliveryCharge' => $deliveryCharge,
            'totalAmount' => $totalAmount
        ]);
    }
    public function GetItemEncrypted(Request $request)
    {
        // $itemsList = json_decode($request->input('itemsList'), true);

        $itemsList = $request->input('itemsList');
        $encryptedItems = [];

        foreach ($itemsList as $item) {
            $item['Quantity'] = Crypt::encryptString($item['Quantity']);
            $item['Price'] = Crypt::encryptString($item['Price']);
            $item['Amount'] = Crypt::encryptString($item['Amount']);
            $encryptedItems[] = $item;
        }

        return response()->json($encryptedItems);

    }
    
}
