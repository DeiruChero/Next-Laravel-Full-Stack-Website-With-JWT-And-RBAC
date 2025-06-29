<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockTransferModel extends Model
{
    use HasFactory;  
     protected $table = 'StockTransferModels';
     protected $primaryKey = 'StockTransferID';
     protected $fillable = [
         'StockTransferID',
         'StockDate',
         'IndentID',         
         'ClientID',
         'ProductID',
         'Quantity',
         'BranchID',
         'created_by', 
         'updated_by',        
     ];   
}
  