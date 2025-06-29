<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminModel extends Model
{
    use HasFactory;      
     protected $table = 'AdminModels';
     protected $primaryKey = 'AdminID';     
     protected $fillable = [
         'AdminID',    
         'AdminName',  
         'Mobile',  
         'WhatsApp',  
         'Email',  
         'Address', 
         'Area', 
         'City', 
         'State', 
         'Country', 
         'PinCode', 
         'UserID',    
         'created_by',
         'updated_by', 
     ];
}
