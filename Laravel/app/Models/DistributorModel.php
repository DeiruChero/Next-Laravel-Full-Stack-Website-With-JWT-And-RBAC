<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistributorModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'DistributorModels';
     protected $primaryKey = 'DistributorID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'DistributorID',    
         'DistributorName',  
         'Mobile',  
         'PanNo',
         'AadharNo',
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

     public function customer(){
        return $this->hasMany(CustomerModel::class, 'DistributorID', 'DistributorID');
     }
}
