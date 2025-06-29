<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedBackModel extends Model
{
    use HasFactory;  
     protected $table = 'FeedBackModels';
     protected $primaryKey = 'FeedBackID';
     protected $fillable = [
         'FeedBackID',
         'FeedBackDate', /// 
         'UserID',
         'OrderNo', 
         'Rating', 
         'FeedBackText', 
         'BranchID',

         'created_by',
         'updated_by',        
     ];    
}
