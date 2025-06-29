<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackingMaterialPurchaseTransModel extends Model
{
    use HasFactory;
    protected $table = 'PackingMaterialPurchaseTransModels';
    protected $primaryKey = 'PurchaseTransID';
    protected $fillable = [
        'PurchaseID', // foreign key
        'PurchaseInvoiceNo', // foreign key
        'PackingMaterialID',
        'RatePerUnit',
        'PurchaseUnit',
        'Quantity',
        'Amount',
        'created_by',
        'updated_by',
    ];
    public function material()
    {
        return $this->belongsTo(PackingMaterialModel::class, 'PackingMaterialID', 'PackingMaterialID');
    }
}
