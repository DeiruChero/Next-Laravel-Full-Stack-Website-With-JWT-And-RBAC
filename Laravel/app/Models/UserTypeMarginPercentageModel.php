<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTypeMarginPercentageModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'UserType',
        'MarginPercentage',
        'TransportationCharges',
        'LabourCharges',
        'BarcodeCharges',
        'BranchID',
    ];
}
