<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialPackingModel extends Model
{
    use HasFactory;     
     protected $table = 'MaterialPackingModels';
     protected $primaryKey = 'MaterialPackingID';      
     protected $fillable = [
         'MaterialPackingID',
         'PackingDate',        
         'ProductID',   
         'Quantity',
         'PackedQuantity',
         'UnitName',
        
         'PackerID',
         'CheckerID',
         'UserType', // Institution ect // client time 
         'Status',
         'Remark', 
         'OrderID',
         'BranchID',

         'created_by',
         'updated_by',
     ];
}
