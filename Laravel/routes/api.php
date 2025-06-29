<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlinkitOrderController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerAddressController;
use App\Http\Controllers\CustomerOrderController;

use App\Http\Controllers\CityController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeliveryBoyController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\DistributorController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\InstitutionOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\PackingMaterialController;
use App\Http\Controllers\PackingMaterialPurchaseController;
use App\Http\Controllers\PackSizeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RelianceOrderController;
use App\Http\Controllers\RequisitionController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RuleController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\SwiggyOrderController;
use App\Http\Controllers\UserTypeMarginPercentageController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VerifyApiController;
use App\Http\Controllers\ClientOrderController;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Http\Middleware\Authenticate as JwtAuthenticate;


Route::post('/loginwithpass', [AuthController::class, 'loginWithPassword'])->name('login');
Route::post('/loginwithotp', [AuthController::class, 'loginWithOtp']);
Route::post('/sendloginotp', [OtpController::class, 'sendLoginOtp']);
Route::post('/sendregisterotp', [OtpController::class, 'sendRegistrationOtp']);
Route::post('/verifyregisterotp', [OtpController::class, 'verifyRegistrationOtp']);
Route::post('/verifyregistrationemail', [AuthController::class, 'verifyRegistrationEmail']);


Route::post('/register', [AuthController::class, 'registerUser']);

Route::get('/products/{branchid}', [ProductController::class, 'products']);
Route::get('/getbrancheslist', [BranchController::class, 'index']);

Route::get('/getallbrancheslist', [BranchController::class, 'getAllBranchesList']);
Route::get('/getbranches', function () {
    return \App\Models\BranchModel::select('BranchID', 'BranchName')->get();
});

// protected routes

Route::group([
    'middleware' => ['api', 'auth:api'],

], function ($router) {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/userproducts', [ProductController::class, 'userProducts']);
    Route::get('/userprofile', [AuthController::class, 'user']);

    Route::get('/userdashboard', [UserController::class, 'userDashboard']);

    Route::get('/getusercity', [CustomerAddressController::class, 'getUserCity']);
    Route::get('/getdeliveryaddresses', [CustomerAddressController::class, 'getDeliveryAddresses']);
    Route::delete('/delete-address/{id}', [CustomerAddressController::class, 'deleteDeliveryAddress']);
    Route::post('/add-address', [CustomerAddressController::class, 'storeAddress']);


    Route::get('/getbranchareas', [BranchController::class, 'getBranchAreas']);
    Route::get('/getbranchdata', [BranchController::class, 'getBranchData']);

    Route::get('/getcustomerorderslist', [CustomerOrderController::class, 'getCustomerOrdersList']);
    Route::get('/getcustomerorderdata/{orderid}', [CustomerOrderController::class, 'getCustomerOrderData']);
    Route::post('/place-order', [CustomerOrderController::class, 'placeOrder']);

    Route::post('/sendorderconfirmationsms', [CustomerOrderController::class, 'sendOrderConfirmationSms']);
    Route::post('/changecustomerpassword', [CustomerController::class, 'changeCustomerPassword']);

    Route::post('/sendchangepassotp', [OtpController::class, 'sendChangePassOtp']);
    Route::post('/verifychangepassotp', [OtpController::class, 'verifyChangePassOtp']);

    Route::post('/deletecustomeraccount', [CustomerController::class, 'deleteCustomerAccount']);

    Route::get('/userrole', [AuthController::class, 'getUserRole']);
});

Route::group(
    [
        'middleware' => ['api', 'auth:api', 'admin']
    ],
    function ($router) {

        // Unit
        Route::get('/unit-data', [UnitController::class, 'index']);
        Route::post('/unit-store', [UnitController::class, 'store']);
        Route::get('/unit-show/{id}', [UnitController::class, 'show']);
        Route::put('/unit-update/{id}', [UnitController::class, 'update']);
        Route::delete('/unit-delete/{id}', [UnitController::class, 'destroy']);

        // Product
        Route::get('/product-data', [ProductController::class, 'index']);
        Route::post('/product-store', [ProductController::class, 'store']);
        Route::get('/product-show/{id}', [ProductController::class, 'show']);
        Route::put('/product-update/{id}', [ProductController::class, 'update']);
        Route::delete('/product-delete/{id}', [ProductController::class, 'destroy']);

        //Distributor related methods
    
        Route::get('/distcustomerlist', [DistributorController::class, 'distributorCustomerList']);
        Route::get('/distallorderslist', [DistributorController::class, 'distributorAllOrdersList']);

        Route::get('/order-data', [OrderController::class, 'index']);

        Route::get('/getordersbydate', [OrderController::class, 'getOrdersByDate']);
        Route::get('/getordersbystatus', [OrderController::class, 'getOrdersByStatus']);

        Route::get('/getrequisitiontitle', [RequisitionController::class, 'getRequisitionTitle']);
        Route::get('/createrequisition', [RequisitionController::class, 'createRequisition']);
    }
);


// Users
Route::get('/users', [UserController::class, 'index']);
// Route::post('/verify-password', [UserController::class, 'verifypassword']);
// Route::get('/user', [UserController::class, 'getLoggedInUser']);
Route::get('/user-show/{id}', [UserController::class, 'show']);
Route::delete('/user-delete/{id}', [UserController::class, 'destroy']);

// creating different user
Route::post('/create-admin', [UserController::class, 'storeAdmin']);
Route::get('/show-admin/{userid}', [UserController::class, 'showAdmin']);


Route::post('/create-insti', [UserController::class, 'storeInsti']);
Route::get('/show-insti/{userid}', [UserController::class, 'showInsti']);

Route::post('/create-newinsti', [UserController::class, 'storeNewInsti']);
Route::post('/create-qc', [UserController::class, 'storeQuickCommerce']);
Route::get('/show-qc/{userid}', [UserController::class, 'showQuickCommerce']);

Route::post('/create-employee', [UserController::class, 'storeEmployee']);
Route::get('/show-employee/{userid}', [UserController::class, 'showEmployee']);
Route::get('/employee-show/{id}', [UserController::class, 'showRelationshipManager']);
Route::get('/employee-relationship-manager', [UserController::class, 'employeeRelationshipManager']);

Route::post('/create-customer', [UserController::class, 'storeCustomer']);
Route::get('/show-customer/{userid}', [UserController::class, 'showCustomer']);

Route::post('/create-distributor', [UserController::class, 'storeDistributor']);
Route::get('/show-distributor/{userid}', [UserController::class, 'showDistributor']);

Route::post('/create-driver', [UserController::class, 'storeDriver']);
Route::get('/show-driver/{userid}', [UserController::class, 'showDriver']);

Route::post('/create-shop-manager', [UserController::class, 'storeShopManager']);
Route::get('/show-shop-manager/{userid}', [UserController::class, 'showShopManager']);



// Roles
Route::post('/roles-store', [RoleController::class, 'store']);
Route::get('/roles-data', [RoleController::class, 'index']);
Route::get('/roles-show/{id}', [RoleController::class, 'show']);
Route::put('/roles-update/{id}', [RoleController::class, 'update']);
Route::delete('/roles-delete/{id}', [RoleController::class, 'destroy']);

// Rules
Route::post('/rules-store', [RuleController::class, 'store']);
Route::get('/rules-data', [RuleController::class, 'index']);
Route::get('/rules-show/{id}', [RuleController::class, 'show']);
Route::put('/rules-update/{id}', [RuleController::class, 'update']);
Route::delete('/rules-delete/{id}', [RuleController::class, 'destroy']);

// Branch
Route::get('/branch-data', [BranchController::class, 'index']);
Route::post('/branch-store', [BranchController::class, 'store']);
Route::get('/branch-show/{id}', [BranchController::class, 'show']);
Route::put('/branch-update/{id}', [BranchController::class, 'update']);
Route::delete('/branch-delete/{id}', [BranchController::class, 'destroy']);



// Pack Size
Route::get('/packsize-data', [PackSizeController::class, 'index']);
Route::post('/packsize-store', [PackSizeController::class, 'store']);
Route::get('/packsize-show/{id}', [PackSizeController::class, 'show']);
Route::delete('/packsize-delete/{id}', [PackSizeController::class, 'destroy']);
Route::put('/packsize-update/{id}', [PackSizeController::class, 'update']);

// Product Groups (Groups)
Route::get('/group-data', [GroupController::class, 'index']);
Route::post('/group-store', [GroupController::class, 'store']);
Route::get('/group-show/{id}', [GroupController::class, 'show']);
Route::put('/group-update/{id}', [GroupController::class, 'update']);
Route::delete('/group-delete/{id}', [GroupController::class, 'destroy']);

// Category
Route::get('/category-data', [CategoryController::class, 'index']);
Route::post('/category-store', [CategoryController::class, 'store']);
Route::get('/category-show/{id}', [CategoryController::class, 'show']);
Route::put('/category-update/{id}', [CategoryController::class, 'update']);
Route::delete('/category-delete/{id}', [CategoryController::class, 'destroy']);

// Packing Material
Route::get('/packingmaterial-data', [PackingMaterialController::class, 'index']);
Route::post('/packingmaterial-store', [PackingMaterialController::class, 'store']);
Route::get('/packingmaterial-show/{id}', [PackingMaterialController::class, 'show']);
Route::put('/packingmaterial-update/{id}', [PackingMaterialController::class, 'update']);
Route::delete('/packingmaterial-delete/{id}', [PackingMaterialController::class, 'destroy']);

// Area
Route::get('/area-data', [AreaController::class, 'index']);
Route::post('/area-store', [AreaController::class, 'store']);
Route::get('/area-show/{id}', [AreaController::class, 'show']);
Route::put('/area-update/{id}', [AreaController::class, 'update']);
Route::delete('/area-delete/{id}', [AreaController::class, 'destroy']);


// City
Route::get('/city-data', [CityController::class, 'index']);
Route::post('/city-store', [CityController::class, 'store']);
Route::get('/city-show/{id}', [CityController::class, 'show']);
Route::put('/city-update/{id}', [CityController::class, 'update']);
Route::delete('/city-delete/{id}', [CityController::class, 'destroy']);

// State
Route::get('/state-data', [StateController::class, 'index']);
Route::post('/state-store', [StateController::class, 'store']);
Route::get('/state-show/{id}', [StateController::class, 'show']);
Route::put('/state-update/{id}', [StateController::class, 'update']);
Route::delete('/state-delete/{id}', [StateController::class, 'destroy']);

// Designation
Route::get('/designation-data', [DesignationController::class, 'index']);
Route::post('/designation-store', [DesignationController::class, 'store']);
Route::get('/designation-show/{id}', [DesignationController::class, 'show']);
Route::put('/designation-update/{id}', [DesignationController::class, 'update']);
Route::delete('/designation-delete/{id}', [DesignationController::class, 'destroy']);

// Vehicle
Route::get('/vehicle-data', [VehicleController::class, 'index']);
Route::post('/vehicle-store', [VehicleController::class, 'store']);
Route::get('/vehicle-show/{id}', [VehicleController::class, 'show']);
Route::put('/vehicle-update/{id}', [VehicleController::class, 'update']);
Route::delete('/vehicle-delete/{id}', [VehicleController::class, 'destroy']);

// User Type Margin Percentage
Route::get('/margin-data', [UserTypeMarginPercentageController::class, 'index']);
Route::post('/margin-store', [UserTypeMarginPercentageController::class, 'store']);
Route::get('/margin-show/{id}', [UserTypeMarginPercentageController::class, 'show']);
Route::put('/margin-update/{id}', [UserTypeMarginPercentageController::class, 'update']);
Route::delete('/margin-delete/{id}', [UserTypeMarginPercentageController::class, 'destroy']);

// Vendor
Route::get('/vendor-data', [VendorController::class, 'index']);
Route::post('/vendor-store', [VendorController::class, 'store']);
Route::get('/vendor-show/{id}', [VendorController::class, 'show']);
Route::put('/vendor-update/{id}', [VendorController::class, 'update']);
Route::delete('/vendor-delete/{id}', [VendorController::class, 'destroy']);

// Delivery Boy
Route::get('/deliveryboy-data', [DeliveryBoyController::class, 'index']);
Route::post('/deliveryboy-store', [DeliveryBoyController::class, 'store']);
Route::get('/deliveryboy-show/{id}', [DeliveryBoyController::class, 'show']);
Route::put('/deliveryboy-update/{id}', [DeliveryBoyController::class, 'update']);
Route::delete('/deliveryboy-delete/{id}', [DeliveryBoyController::class, 'destroy']);

// Customer
Route::get('/customer-data', [CustomerController::class, 'index']);
Route::post('/customer-store', [CustomerController::class, 'store']);
Route::get('/customer-show/{id}', [CustomerController::class, 'show']);
Route::put('/customer-update/{id}', [CustomerController::class, 'update']);
Route::delete('/customer-delete/{id}', [CustomerController::class, 'destroy']);

// Order
// Route::get('/order-data', [OrderController::class, 'index']);
Route::post('/order-store', [OrderController::class, 'store']);
Route::get('/order-show/{id}', [OrderController::class, 'show']);
Route::put('/order-update/{id}', [OrderController::class, 'update']);
Route::delete('/order-delete/{id}', [OrderController::class, 'destroy']);

// Latest Order Number
Route::get('/latest-order-no', [OrderController::class, 'latestOrderNo']);

// Customer Order Create
Route::get('/customerordercreate-data', [CustomerOrderController::class, 'index']);
Route::post('/ordercreate-store', [OrderController::class, 'store']);

// Insti Order Create
Route::get('/institutionordercreate-data', [InstitutionOrderController::class, 'index']);

// Blinkit Order Create
Route::get('/blinkitordercreate-data', [BlinkitOrderController::class, 'index']);

// Swiggy Order Create
Route::get('/swiggyordercreate-data', [SwiggyOrderController::class, 'index']);

// Reliance Order Create
Route::get('/relianceordercreate-data', [RelianceOrderController::class, 'index']);

// Packing Material Purchase
Route::get('/packingmaterialpurchase-data', [PackingMaterialPurchaseController::class, 'index']);
Route::get('/packingmaterialpurchaseitem-data', [PackingMaterialController::class, 'packingMaterialData']);
Route::post('/packingmaterialpurchase-store', [PackingMaterialPurchaseController::class, 'store']);
Route::get('/packingmaterialpurchase-info/{id}', [PackingMaterialPurchaseController::class, 'showInfo']);
Route::delete('/packingmaterialpurchase-delete/{id}', [PackingMaterialPurchaseController::class, 'destroy']);
Route::put('/packingmaterialpurchase-update/{id}', [PackingMaterialPurchaseController::class, 'update']);

// Purchase Invoice Number
Route::get('/purchase-invoice-no', [PackingMaterialPurchaseController::class, 'purchaseInvoiceNo']);
// Vendor Data
Route::get('/select-vendor-data', [VendorController::class, 'selectVendorData']);
Route::get('/vendor-info/{id}', [VendorController::class, 'showInfo']);

// Customer Order Cancel
Route::get('/ordercancelcustomer-data', [CustomerOrderController::class, 'orderCancelData']);
Route::get('/ordercancelcustomer-show/{id}', [CustomerOrderController::class, 'orderCancelShow']);
Route::put('/ordercancelcustomer-cancel/{id}', [CustomerOrderController::class, 'orderCancelledCustomer']);

// Institution Order Cancel
Route::get('/ordercancelinstitution-data', [InstitutionOrderController::class, 'orderCancelData']);
Route::get('/ordercancelinstitution-show/{id}', [InstitutionOrderController::class, 'orderCancelShow']);
Route::put('/ordercancelinstitution-cancel/{id}', [InstitutionOrderController::class, 'orderCancelledInstitution']);

// Blinkit Order Cancel
Route::get('/ordercancelblinkit-data', [BlinkitOrderController::class, 'orderCancelData']);
Route::get('/ordercancelblinkit-show/{id}', [BlinkitOrderController::class, 'orderCancelShow']);

// Swiggy Order Cancel
Route::get('/ordercancelswiggy-data', [SwiggyOrderController::class, 'orderCancelData']);
Route::get('/ordercancelswiggy-show/{id}', [SwiggyOrderController::class, 'orderCancelShow']);

// Reliance Order Cancel
Route::get('/ordercancelreliance-data', [RelianceOrderController::class, 'orderCancelData']);
Route::get('/ordercancelreliance-show/{id}', [RelianceOrderController::class, 'orderCancelShow']);

// Order Edit
Route::put('/orderedit-update', [CustomerOrderController::class, 'orderUpdateCustomer']);
// Route::put('/ordereditinstitution-update/{id}', [InstitutionOrderController::class, 'orderEditInstitution']);
// Route::put('/ordereditblinkit-update/{id}', [BlinkitOrderController::class, 'orderEditBlinkit']);
// Route::put('/ordereditswiggy-update/{id}', [SwiggyOrderController::class, 'orderEditSwiggy']);
// Route::put('/ordereditreliance-update/{id}', [RelianceOrderController::class, 'orderEditReliance']);


// indent
Route::post('/materialpreview', [OrderController::class, 'materialPreview']);

// Show Branch Name & ID
Route::get('/showallbranches', [BranchController::class, 'showAllBranches']);

// User Edit Info
Route::get('/user-info/{id}', [UserController::class, 'showInfo']);

// User Rules
Route::get('/user-rules/{id}', [UserController::class, 'showRules']);

// Update Users
Route::put('/update-admin/{id}', [UserController::class, 'updateAdmin']);
Route::put('/update-shop-manager/{id}', [UserController::class, 'updateShopManager']);
Route::put('/update-distributor/{id}', [UserController::class, 'updateDistributor']);
Route::put('/update-customer/{id}', [UserController::class, 'updateCustomer']);
Route::put('/update-driver/{id}', [UserController::class, 'updateDriver']);
Route::put('/update-employee/{id}', [UserController::class, 'updateEmployee']);
Route::put('/update-qc/{id}', [UserController::class, 'updateQc']);
Route::put('/update-insti/{id}', [UserController::class, 'updateInsti']);
