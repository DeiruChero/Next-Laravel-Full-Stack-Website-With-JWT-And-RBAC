<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class UserRecoveryModel extends Model
{
    use HasFactory;    
     protected $table = 'UserRecoveryModels';
     protected $primaryKey = 'UserID';     
     protected $fillable = [
         'UserID',  
         'Picture',
         'DisplayName',       
         'Mobile', // primary id (customer)
         'Email', // secondry id ( institution)
         'Password', 
         'UserType', // Admin,Customer,Institution, NewInstitution,Supplier(Former), Supplier(Trader),ShopManager, Distrubuter,     
         'Status', // Active / Deactive 
         'BranchID',         
         'created_by',
         'updated_by', 
     ];
}
