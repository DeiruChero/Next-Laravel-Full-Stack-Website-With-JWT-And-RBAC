<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CountryModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'CountryModels';
     protected $primaryKey = 'CountryID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'CountryID',
         'CountryName',
         'Region', 
         'created_by',
         'updated_by',   
        
     ];
}
