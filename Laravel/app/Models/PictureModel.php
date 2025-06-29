<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PictureModel extends Model
{
    use HasFactory;  
     protected $table = 'PictureModels';
     protected $primaryKey = 'PictureID';
     protected $fillable = [
         'PictureID',   
         'PictureDate', //     
         'UserID',
         'FeedBackID',          
         'ComplaintID', 
         'OrderNo', 
         'Picture', 
         'BranchID',

         'created_by',
         'updated_by',        
     ];   
}
