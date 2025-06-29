<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleModel extends Model
{
    use HasFactory;
    protected $table = 'RoleModels';
    protected $primaryKey = 'RoleID';
    protected $fillable = [
        'RoleName',
        'Remark'
    ];
    public function users()
    {
        return $this->hasMany(UserModel::class, 'RoleID', 'RoleID');
    }
    public function rules()
    {
        return $this->belongsToMany(RulesModel::class, 'RoleRulesModels', 'RoleID', 'RulesID');
    }
}
