<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryBoyAssignModel extends Model
{
    use HasFactory;    

    protected $primaryKey = 'OrderAssignID';
     protected $table = 'DeliveryBoyAssignModels';   
     protected $fillable = [
         'OrderAssignID',
         'AssignDate',
         'OrderID',
         'DeliveryBoyEmpID',      
     ];

     public function order(){
        return $this->belongsTo(OrderModel::class, 'OrderID');
     }

     public function deliveryBoy(){
        return $this->belongsTo(EmployeeModel::class, 'DeliveryBoyEmpID', 'EmployeeID');
     }
}
