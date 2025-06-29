<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AreaModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'AreaModels';
     protected $primaryKey = 'AreaID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'AreaID',
         'AreaName',        
         'CityID',   
         'PinCode',
         'created_by',
         'updated_by',
     ];

     public function city(){
        return $this->belongsTo(CityModel::class, 'CityID', 'CityID');
     }
}
