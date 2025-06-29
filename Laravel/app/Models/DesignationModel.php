<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignationModel extends Model
{
    use HasFactory;    
     protected $table = 'DesignationModels';
     protected $primaryKey = 'DesignationID';    
     protected $fillable = [
         'DesignationID',
         'DesignationName',
         'Remark', 
         'created_by',
         'updated_by',        
     ];
}
