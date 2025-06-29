<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class DeliveryAddressModel extends Model
{
    use HasFactory;     
     protected $table = 'DeliveryAddressModels';
     protected $primaryKey = 'DeliveryAddressID';     
     protected $fillable = [
         'DeliveryAddressID',    
         'AddressTitle',  // default address / home address / office address etc 
         'DisplayName',
         'Mobile',  
         'WhatsApp',  
         'Email',  
         'Address', 
         'Area', 
         'City', 
         'State', 
         'Country', 
         'PinCode', 
         'IsDefault', // yes / no 
         'UserID', // for unique         
         'created_by',
         'updated_by', 
     ];
}
