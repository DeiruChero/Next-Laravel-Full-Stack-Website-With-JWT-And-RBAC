<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMaterialModel extends Model
{
    use HasFactory;  
     protected $table = 'StockMaterialModels';
     protected $primaryKey = 'StockMaterialID';
     protected $fillable = [
         'StockMaterialID',
         'StockFor',  // QC / Ins
         'StockDate', 
         'IndentID',
         'ProductID',         
         'RequiredQuantity',
         'TotalReceived',
         'UsableQuantity',
         'ClientID', // Stock Transfer To 
         'MaterialWastage',         
         'BranchID',
         'created_by', 
         'updated_by',        
     ];   
}
 