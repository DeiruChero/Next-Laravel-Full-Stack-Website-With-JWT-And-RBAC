<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishListModel extends Model
{
    use HasFactory;     
     protected $table = 'WishListModels';
     protected $primaryKey = 'WishListID';     
     protected $fillable = [
         'WishListID',        
         'ProductID',  
         'Quantity',
         'UserID', 
     ];
}
