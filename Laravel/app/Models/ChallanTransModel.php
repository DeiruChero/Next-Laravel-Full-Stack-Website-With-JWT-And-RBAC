<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallanTransModel extends Model
{
    use HasFactory;     
     protected $table = 'ChallanTransModels';
     protected $primaryKey = 'ChallanTransID';     
     protected $fillable = [
         'ChallanTransID',        
         'ProductID',  
         'Quantity',            
         'Rate',          
         'Amount',         
         'ChallanID', // forgin key  
         'created_by',
         'updated_by',        
     ];
}
