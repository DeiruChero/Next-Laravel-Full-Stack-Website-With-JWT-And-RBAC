<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'CategoryModels';
     protected $primaryKey = 'CategoryID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'CategoryID',
         'CategoryName',
         'Remark', 
         'created_by',
         'updated_by',   
         'PercentageMargin', 
         'SortingLossPercentage',   
         'WeightLossPercentage',
     ];
}
