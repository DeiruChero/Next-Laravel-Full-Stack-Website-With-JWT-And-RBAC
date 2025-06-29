<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitModel extends Model
{
    use HasFactory;  
     protected $table = 'UnitModels';
     protected $primaryKey = 'UnitID';
     protected $fillable = [
         'UnitID',
         'UnitName',
         'Remark', 
         'created_by',
         'updated_by',        
     ];   
}
