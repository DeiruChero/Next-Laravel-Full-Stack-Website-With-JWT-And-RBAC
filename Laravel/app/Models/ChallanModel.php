<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallanModel extends Model
{
    use HasFactory;     
     protected $table = 'ChallanModels';
     protected $primaryKey = 'ChallanID';     
     protected $fillable = [
         'ChallanID',
         'ChallanNo',  
         'OrderNo', 
         'ChallanDate', // date 
         'UserType', // customer / institution / retailer / shopmanager / admin
         'ClientID', // from customer / institution / retailer / shopmanager / admin  
         'AddressTitle', // Home / Offiice / Default          
         'SubTotal',
         'DeliveryCharges',
         'TotalAmount',
         'OrderID',  
         'BranchID',
         'created_by',
         'updated_by',        
     ];
}
