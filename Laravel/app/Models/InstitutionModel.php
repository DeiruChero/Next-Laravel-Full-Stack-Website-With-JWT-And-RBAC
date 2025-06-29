<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstitutionModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'InstitutionModels';
     protected $primaryKey = 'InstitutionID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'InstitutionID', 
         'InstitutionName', 
         
         'GSTNo', 
         'BillingPercent', 
         'EmployeeID',

         'OwnerName', 
         'OwnerMobile',  

         'ContactPersonName1', 
         'CPMobile1', 
         'CPWhatsApp1',  
         'CPEmail1',

         'ContactPersonName2', 
         'CPMobile2', 
         'CPWhatsApp2',  
         'CPEmail2',

         'InstitutionEmail',   
         'GSTNo',         
         'Address', 
         'Area', 
         'City', 
         'State', 
         'Country', 
         'PinCode',         
         'UserID',   

         'DeliveryTime',
         'PaymentMode',
         'PriceType',         
         
         'created_by',
         'updated_by',
     ];
}
