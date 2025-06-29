<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistributorSaleModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'DistributorSaleModels';
     protected $primaryKey = 'DistributorSaleID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'DistributorSaleID', 
         'OrderDate',    
         'OrderID',  
         'OrderNo',
         'TotalAmount',
         'OrderStatus',         
         'ClientID',         
         'DistributorID',   
         'created_by',
         'updated_by', 
     ];
}
