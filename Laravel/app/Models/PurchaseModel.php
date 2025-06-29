<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseModel extends Model
{
    use HasFactory;     
     protected $table = 'PurchaseModels';
     protected $primaryKey = 'PurchaseID';     
     protected $fillable = [
         'PurchaseID',       
         'PurchaseDate',   
         'PurchaseNo', 

         'IndentNo', 
         'PiDate',   
         'PiNo',

         'VenderID', 
         'TotalAmount',
         'Remark',          
         'BranchID',
         'PaymentType', // 1 = Cash, 2 = google pay  etc      
         
         'created_by',
         'updated_by',        
     ]; 
}
