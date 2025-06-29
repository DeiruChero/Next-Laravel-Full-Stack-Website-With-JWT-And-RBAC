<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndentWisePurchaseModel extends Model
{
    use HasFactory;  
     protected $table = 'IndentWisePurchaseModels';
     protected $primaryKey = 'IndentWisePurchaseID';
     protected $fillable = [
         'IndentWisePurchaseID',
         'IndentID',
         'ProductID', 
         'Qty',
         'Rate',          
         'ComPerPcs', 
         'TotalCom',
         'Amount',
         'Status',
         'created_by',
         'updated_by',        
     ];   
}