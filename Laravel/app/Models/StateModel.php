<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StateModel extends Model
{
    use HasFactory;
    // Specify the table if it's not the plural of the model name
    protected $table = 'StateModels';
    protected $primaryKey = 'StateID'; // Specify your primary key here
    // Define the fillable properties
    protected $fillable = [
        'StateID',
        'StateName',
        'StateType',
        'CountryID',
        'created_by',
        'updated_by',
    ];
    public function country()
    {
        return $this->belongsTo(CountryModel::class, 'CountryID', 'CountryID');
    }
}
