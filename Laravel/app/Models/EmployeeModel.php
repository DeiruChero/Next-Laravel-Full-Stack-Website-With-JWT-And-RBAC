<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeModel extends Model
{
    use HasFactory;    
     protected $table = 'EmployeeModels';
     protected $primaryKey = 'EmployeeID';    
     protected $fillable = [
         'EmployeeID',    
         'EmployeeName',  

         'DesignationID',
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
         'DistributorID',     
         'created_by',
         'updated_by', 
     ];


     public function assignedOrders()
     {
        return $this->hasMany(DeliveryBoyAssignModel::class, 'DeliveryBoyEmpID', 'EmployeeID');
     }

     public function designation() {
        return $this->belongsTo(DesignationModel::class, 'DesignationID');
     }
}
