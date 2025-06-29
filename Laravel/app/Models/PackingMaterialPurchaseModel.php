<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackingMaterialPurchaseModel extends Model
{
    use HasFactory;
    protected $table = 'PackingMaterialPurchaseModels';
    protected $primaryKey = 'PurchaseID';
    protected $fillable = [
        'PurchaseInvoiceNo', // format PI-1-020525
        'PurchaseDate',
        'Subtotal',
        'OtherCharges',
        'GrandTotal',
        'PaymentStatus',  // paid unpaid
        'VendorID', // foreign key
        'BranchID', // foreign key
        'Remark',
        'created_by',
        'updated_by',
    ];
    public function purchase()
    {
        return $this->belongsTo(VenderModel::class, 'VendorID', 'VenderID');
    }
    public function vendor()
    {
        return $this->belongsTo(VenderModel::class, 'VendorID', 'VenderID');
    }
}
