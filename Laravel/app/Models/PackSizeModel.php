<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackSizeModel extends Model
{
    use HasFactory;    
     protected $table = 'PackSizeModels';
     protected $primaryKey = 'PackSizeID';     
     protected $fillable = [
         'PackSizeID',
         'PackSizeName',
         'Facter',
         'created_by',
         'updated_by',         
     ];
}
