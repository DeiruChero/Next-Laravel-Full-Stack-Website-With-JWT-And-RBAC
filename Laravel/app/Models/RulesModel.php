<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RulesModel extends Model
{
    use HasFactory;
    protected $table = 'RulesModels';
    protected $primaryKey = 'RulesID';
    protected $fillable = [
        'RulesName',
        'RulesGroup',
        'Link'
    ];
}
