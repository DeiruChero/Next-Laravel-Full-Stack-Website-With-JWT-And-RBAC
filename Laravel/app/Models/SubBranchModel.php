<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubBranchModel extends Model
{
    use HasFactory;     
     protected $table = 'SubBranchModels';
     protected $primaryKey = 'SubBranchID';      
     protected $fillable = [
         'SubBranchID',
         'SubBranchName',
         'ShortName',
         'Address',
         'CityID',
         'City',
         'State',
         'Country',
         'PinCode', 
         'ContactPerson',
         'Mobile',
         'Email',
         'Picture',
         'BranchID',
         'created_by',
         'updated_by',   
     ];
}
