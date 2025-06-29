<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WastedHistoryModel extends Model
{
    use HasFactory;  
     protected $table = 'WastedHistoryModels';
     protected $primaryKey = 'WastedHistoryID';
     protected $fillable = [
         'WastedHistoryID',
         'WastedHistoryDate',
         'ProductID',         
         'Quantity',
         'UnitID',
         'BranchID',
         'created_by', 
         'updated_by',        
     ];   
}
