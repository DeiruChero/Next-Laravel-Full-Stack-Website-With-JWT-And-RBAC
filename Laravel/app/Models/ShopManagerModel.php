<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopManagerModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'ShopManagerModels';
     protected $primaryKey = 'ShopManagerID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'ShopManagerID',    
         'ShopManagerName',  
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
