<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchModel extends Model
{
    use HasFactory;
    protected $table = 'BranchModels';
    protected $primaryKey = 'BranchID';
    protected $fillable = [
        'BranchID',
        'BranchName',
        'ShortName',
        'Address',
        'CityID',
        'City',
        'State',
        'GSTNo',
        'Country',
        'PinCode',
        'ContactPerson',
        'Mobile',
        'Email',
        'Picture',
        'created_by',
        'updated_by',
    ];

    public function users()
    {
        return $this->hasMany(UserModel::class, 'BranchID', 'BranchID');
    }

    public function city()
    {
        return $this->belongsTo(CityModel::class, 'CityID', 'CityID');
    }
}
