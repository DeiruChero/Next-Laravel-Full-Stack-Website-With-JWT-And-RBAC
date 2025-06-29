<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuickCommerceModel extends Model
{
    use HasFactory;
    protected $table = 'QuickCommerceModels';
    protected $primaryKey = 'QuickCommerceID';
    protected $fillable = [
        'QuickCommerceID',

        'PlatformName',
        'PlatformMobile',
        'PlatformEmail',
        'PlatformGSTNo',

        'ProductCode',
        'ProductName',
        'ProductPrice',

        'ContactPersonName1',
        'CPMobile1',
        'CPWhatsApp1',
        'CPEmail1',

        'ContactPersonName2',
        'CPMobile2',
        'CPWhatsApp2',
        'CPEmail2',

        'Address',
        'Area',
        'City',
        'State',
        'Country',
        'PinCode',
        'UserID',
        'ProductName',

        'created_by',
        'updated_by',
    ];
    public function user()
    {
        return $this->belongsTo(UserModel::class, 'UserID', 'UserID');
    }
}
