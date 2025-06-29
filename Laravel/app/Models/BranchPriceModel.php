<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class BranchPriceModel extends Model
{
    use HasFactory;     
     protected $table = 'BranchPriceModels';
     protected $primaryKey = 'BranchPriceID';      
     protected $fillable = [
         'BranchPriceID',         
         'ProductID',
         'PurchasePrice',  
         'InstitutionPrice', 
         'NewInstitutionPrice',  //1
         'CustomerPrice',       
         'EmployeePrice', 
         'SwiggyPrice', 
         'BlinkitPrice', 
         'ReliencePrice', 
         'IsEnable', // add this column
         'BranchID', 
         'created_by',
         'updated_by',    
     ];
}


