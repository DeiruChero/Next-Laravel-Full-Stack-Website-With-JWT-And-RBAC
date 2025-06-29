<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerModel extends Model
{
    use HasFactory;
    // Specify the table if it's not the plural of the model name
    protected $table = 'CustomerModels';
    protected $primaryKey = 'CustomerID'; // Specify your primary key here
    // Define the fillable properties
    protected $fillable = [
        'CustomerID',
        'CustomerName',
        'Mobile',
        'WhatsApp',
        'Email',
        'Address',
        'Area',
        'City',
        'State',
        'Country',
        'PinCode',
        'UserID',
        'IsUnderDistributor', // true or false
        'DistributorID',
        'created_by',
        'updated_by',
    ];

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'UserID', 'UserID');
    }
    public function distributor()
    {
        return $this->belongsTo(DistributorModel::class, 'DistributorID', 'DistributorID');
    }

    public function orders(){
        return $this->hasMany(OrderModel::class, 'ClientID', 'UserID');
    }
}
