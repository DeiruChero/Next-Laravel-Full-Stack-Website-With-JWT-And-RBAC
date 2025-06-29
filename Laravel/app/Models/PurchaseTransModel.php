<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseTransModel extends Model
{
    use HasFactory;     
     protected $table = 'PurchaseTransModels';
     protected $primaryKey = 'PurchaseTransID';     
     protected $fillable = [
         'PurchaseTransID',        
         'ProductID',  

         'Bags',   
         'Quantity',    
         'ReqQuantity',               
         'Rate',    
         'FrightCharges',
         'TotalComm', 
         'TotalAmount',

         'PurchaseID',  
         'created_by',
         'updated_by',      //   
     ];
}
