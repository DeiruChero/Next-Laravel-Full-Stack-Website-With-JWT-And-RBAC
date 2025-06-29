<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockHistoryModel extends Model
{
    use HasFactory;  
     protected $table = 'StockHistoryModels';
     protected $primaryKey = 'StockHistoryID';
     protected $fillable = [
         'StockHistoryID',
         'StockHistoryDate',
         'ProductID',         
         'Quantity',
         'WastedQuantity',
         'UnitID',
         'BranchID',
         'created_by', 
         'updated_by',        
     ];   
}
 