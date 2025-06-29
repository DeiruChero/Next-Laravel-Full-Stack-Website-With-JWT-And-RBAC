<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DispatchRegisterModel extends Model
{
    use HasFactory;  
     protected $table = 'DispatchRegisterModels';
     protected $primaryKey = 'DispatchRegisterID';
     protected $fillable = [
         'DispatchRegisterID',
         'DriverID', // userid 
         'DeliveryBoyID', // userid
         'OrderID',
         'DispatchDate', 
         'DispatchTime', 
         'DeliveryTime', 
         'DeliveryStatus',  // defult value // Pending 
         'DeliveredByID', // user 

         
         'created_by',
         'updated_by',        
     ];   
}
