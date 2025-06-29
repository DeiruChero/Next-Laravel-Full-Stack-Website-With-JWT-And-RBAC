<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackingMaterialModel extends Model
{
    use HasFactory;
    protected $table = 'PackingMaterialModels';
    protected $primaryKey = 'PackingMaterialID';
    protected $keyType = 'int';
    protected $fillable = [
        'PackingMaterialID',
        'PackingMaterialName',
        'Weight',
        'PcsPerUnit',
        'Remark',
        'created_by',
        'updated_by',
        'PurchaseUnit',
        'MinimumPurchaseQty',
        'PackagingCost',
        'BranchID'
    ];
}
