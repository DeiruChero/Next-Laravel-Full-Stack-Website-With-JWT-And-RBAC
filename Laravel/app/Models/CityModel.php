<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CityModel extends Model
{
    use HasFactory;
    protected $table = 'CityModels';
    protected $primaryKey = 'CityID';
    protected $fillable = [
        'CityID',
        'CityName',
        'StateID',
        'created_by',
        'updated_by',
    ];

    public function state()
    {
        return $this->belongsTo(StateModel::class, 'StateID', 'StateID');
    }

    public function areas()
    {
        return $this->hasMany(AreaModel::class, 'CityID', 'CityID');
    }
}
