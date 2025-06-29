<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleModel extends Model
{
    use HasFactory;
    protected $table = 'VehicleModels';
    protected $primaryKey = 'VehicleID';
    protected $fillable = [
        'VehicleID',

        'VehicleName',

        'VehicleNumber', // text
        'Make', //text 

        'Model', //text
        'YearofManufacture', //text

        'VehicleType', // drop
        'RegistrationNumber', // text

        'EngineType', // drown        
        'EngineCapacity', // text

        'Mileage',  // text
        'FuelCapacity',  // text

        'BranchID',

        'created_by',
        'updated_by',
    ];
}
