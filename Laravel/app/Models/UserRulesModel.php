<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRulesModel extends Model
{
    use HasFactory;
    protected $table = 'UserRulesModels';
    protected $primaryKey = 'UserRulesID';
    protected $fillable = [
        'UserID',
        'RulesID'
    ];
}
