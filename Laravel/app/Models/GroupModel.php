<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class GroupModel extends Model
{
    use HasFactory;   
     protected $table = 'GroupModels';
     protected $primaryKey = 'GroupID';      
     protected $fillable = [
        'GroupName',
     ];
}
