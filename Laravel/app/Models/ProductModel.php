<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductModel extends Model
{
    use HasFactory;
    protected $table = 'ProductModels';
    protected $primaryKey = 'ProductID';
    protected $fillable = [
        'ProductID',

        'GroupID',

        'AlternativeID',

        'ItemCodeSwiggy', // Swiggy
        'NameSwiggy',
        'StorageSwiggy',
        'ShelfLifeSwiggy',
        'UOMSwiggy',

        'ItemCodeBlinkit', // Blinkit
        'NameBlinkit',
        'UOMBlinkit',

        'ItemCodeRelience', // Relience
        'NameRelience',
        'UOMRelience',


        'ProductName',
        'ProductUnicodeName',
        'ProductHindiName',
        'MinOrderQty',
        'Picture',
        'UnitID',
        'PackSizeID',
        'CategoryID',
        'PackingMaterialID', // Packing Material IDs
        'created_by',
        'updated_by',
    ];
    public function unit()
    {
        return $this->belongsTo(UnitModel::class, 'UnitID', 'UnitID');
    }

    public function category()
    {
        return $this->belongsTo(CategoryModel::class, 'CategoryID', 'CategoryID');
    }

    public function branchprices()
    {
        return $this->hasMany(BranchPriceModel::class, 'ProductID', 'ProductID');
    }
    public function packsize()
    {
        return $this->belongsTo(PackSizeModel::class, 'PackSizeID', 'PackSizeID');
    }

    public function packingMaterial()
    {
        return $this->belongsTo(PackingMaterialModel::class, 'PackingMaterialID', 'PackingMaterialID');
    }
    public function group()
    {
        return $this->belongsTo(GroupModel::class, 'GroupID', 'GroupID');
    }
}
