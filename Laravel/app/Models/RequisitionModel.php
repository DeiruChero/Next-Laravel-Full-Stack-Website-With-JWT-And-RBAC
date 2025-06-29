<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequisitionModel extends Model
{
    use HasFactory;    
     protected $table = 'RequisitionModels';
     protected $primaryKey = 'RequisitionID';      
     protected $fillable = [
         'RequisitionID',
         'RequisitionDate',         
         'RequisitionTitle', 
         'BranchID',
         'Status', // indent and purchase 
         'PurchaserID', // 0 , 
         'created_by',
         'updated_by',        
     ];
}
