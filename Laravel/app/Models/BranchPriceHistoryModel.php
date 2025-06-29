<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchPriceHistoryModel extends Model
{
    use HasFactory;

    protected $primaryKey = 'BranchPriceHistoryID';

    protected $fillable = [
        'Date',
        'PurchasePrice',
        'InstitutionPrice',
        'NewInstitutionPrice',
        'CustomerPrice',
        'BranchID',
        'ProductID',
        'created_by',
        'updated_by',

    ];

}


