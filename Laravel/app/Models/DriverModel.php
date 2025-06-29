<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverModel extends Model
{
    use HasFactory;    
     protected $table = 'DriverModels';
     protected $primaryKey = 'DriverID';    
     protected $fillable = [
         'DriverID',    
         'DriverName',  

         'VehicleID',
         'Gender',
         
         'DateofBirth',
         'DateJoined',
        
         'Salary',
         
         'Address', 
         'Mobile',  
         'WhatsApp',  
         'Email',  
        
         'Area', 
         'City', 
         'State',         
         'PinCode', 
         'Picture',       
         
         'UserID',  

         'created_by',
         'updated_by', 
     ];
}
