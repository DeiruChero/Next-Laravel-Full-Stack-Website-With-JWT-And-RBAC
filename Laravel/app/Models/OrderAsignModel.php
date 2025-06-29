<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderAsignModel extends Model
{
    use HasFactory;    
     protected $table = 'OrderAsignModels';
     protected $primaryKey = 'OrderAsignID';     
     protected $fillable = [
         'OrderAsignID',
         'AsignDate',
         'PackerID',
         'CheckerID',
         'OrderID',
         'Status', 
         'created_by',
         'updated_by',        
     ];
}
