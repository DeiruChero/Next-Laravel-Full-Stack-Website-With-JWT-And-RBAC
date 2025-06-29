<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequisitionTransModel extends Model
{
    use HasFactory;    
     protected $table = 'RequisitionTransModels';
     protected $primaryKey = 'RequisitionTransID';      
     protected $fillable = [
         'RequisitionTransID',        
         'OrderID',
         'RequisitionID', 
         'created_by',
         'updated_by',        
     ];
}
