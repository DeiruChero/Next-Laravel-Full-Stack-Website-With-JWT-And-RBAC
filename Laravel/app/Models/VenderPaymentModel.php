<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenderPaymentModel extends Model
{
    use HasFactory;    
     protected $table = 'VenderPaymentModels';
     protected $primaryKey = 'VenderPaymentID';    
     protected $fillable = [
         'VenderPaymentID',  

         'PaymentDate',
         'PaymentAmount',

         'PaymentType', // By defual P / R
         'PaymentMode',  // online / cash // google / paytm     

         'Remark',
         
         'VenderID',         
         'BranchID',           
         'created_by',
         'updated_by', 
     ];
}
