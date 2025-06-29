<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComplaintModel extends Model
{
    use HasFactory;  
     protected $table = 'ComplaintModels';
     protected $primaryKey = 'ComplaintID';
     protected $fillable = [
         'ComplaintID',
         'ComplaintDate', // 
         'ComplaintToken',
         'UserID',
         'OrderNo',          
         'ComplaintText', 
         'BranchID',

         'created_by',
         'updated_by',        
     ];   
}
