<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderModel extends Model
{
    use HasFactory;
    protected $table = 'OrderModels';
    protected $primaryKey = 'OrderID';
    protected $fillable = [
        'OrderID',
        'OrderNo', // auto Generate 
        'PaymentOrderNo',
        'OrderDate', // date 
        'DeliveredDate',
        'DeliveredTime',
        'UserType', // customer / institution / retailer / shopmanager / admin
        'ClientID', // from customer / institution / retailer / shopmanager / admin         
        'OrderStatus', // Ordered / Process / Cancelled, outfordelivery / Delivered
        'OrderMode', // online / offline / cod 
        'AddressTitle', // Home / Offiice / Default 
        'PaymentMode', // online / offline / cod
        'PaymentStatus', // Paid / UpPaid/
        'SubTotal',
        'DeliveryCharges',
        'Discount',
        'TotalAmount',
        'Remark',
        'BranchID',
        'PONumber',
        'PODate',
        'created_by',
        'updated_by',
    ];

    public function orderDetails()
    {
        return $this->hasMany(OrderTransModel::class, 'OrderID', 'OrderID');
    }
    public function branch()
    {
        return $this->belongsTo(BranchModel::class, 'BranchID', 'BranchID');
    }
    public function client()
    {
        return $this->belongsTo(UserModel::class, 'ClientID', 'UserID');
    }
    public function customer()
    {
        return $this->belongsTo(CustomerModel::class, 'ClientID', 'UserID');
    }

    public function user(){
        return $this->belongsTo(UserModel::class, 'ClientID', 'UserID');
    }
}
