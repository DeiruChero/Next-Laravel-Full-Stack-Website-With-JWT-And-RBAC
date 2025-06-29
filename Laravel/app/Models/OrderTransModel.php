<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderTransModel extends Model
{
    use HasFactory;
    protected $table = 'OrderTransModels';
    protected $primaryKey = 'OrderTransID';
    protected $fillable = [
        'OrderTransID',
        'ProductID',
        'Quantity',
        'Rate',
        'Amount',

        'OrderID', // forgin key  
        'created_by',
        'updated_by',
    ];

    public function order()
    {
        return $this->belongsTo(OrderModel::class, 'OrderID', 'OrderID');

    }
    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'ProductID', 'ProductID');
    }

}
