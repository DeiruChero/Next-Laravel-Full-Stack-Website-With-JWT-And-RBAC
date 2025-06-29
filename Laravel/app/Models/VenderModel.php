<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenderModel extends Model
{
    use HasFactory;
    protected $table = 'VenderModels';
    protected $primaryKey = 'VenderID';
    protected $fillable = [
        'VenderID',
        'VenderName',
        'GSTNo',
        'Mobile',
        'WhatsApp',
        'Email',
        'Address',
        'Area',
        'City',
        'State',
        'PinCode',
        'BranchID',

        'Mobile2',
        'Mobile3',
        'VenderType',

        'BenificiaryName',
        'BankName',
        'BranchName',
        'AccountNo',
        'IFSCCode',


        'created_by',
        'updated_by',
    ];
}
