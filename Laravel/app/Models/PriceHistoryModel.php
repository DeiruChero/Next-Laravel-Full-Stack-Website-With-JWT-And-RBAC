<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class PriceHistoryModel extends Model
{
    use HasFactory;     
     protected $table = 'PriceHistoryModels';
     protected $primaryKey = 'PriceHistoryID';      
     protected $fillable = [
         'PriceHistoryID',  
         'HistoryDate',

         'ProductID',
         'PurchasePrice',  
         'InstitutionPrice', 
         'NewInstitutionPrice', 
         'CustomerPrice',       
         'EmployeePrice', 

         'SwiggyPrice', 
         'BlinkitPrice', 
         'ReliencePrice',   
               
         'BranchID', 
         'created_by',
         'updated_by',    
     ];
}
 

