<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientPaymentModel extends Model
{
    use HasFactory;    
     protected $table = 'ClientPaymentModels';
     protected $primaryKey = 'ClientPaymentID';    
     protected $fillable = [
         'ClientPaymentID',    
         'PaymentDate',
         'PaymentAmount',
         'PaymentType', // By defual P / R
         'PaymentMode',  // online / cash // google / paytm        
         'Remark',
         'ClientID',         
         'BranchID',           
         'created_by',
         'updated_by',  
     ];
}
