<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleRulesModel extends Model
{
    use HasFactory;
    protected $table = 'RoleRulesModels';
    protected $primaryKey = 'RoleRulesID';
    protected $fillable = [
        'RoleID',
        'RulesID'
    ];
}
