<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class UserModel extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $table = 'UserModels';
    protected $primaryKey = 'UserID';
    public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = [
        'UserID',
        'Picture',
        'DisplayName',
        'Mobile', // primary id (customer)
        'Email', // secondry id ( institution)
        'Password',
        'UserType', // Admin,Customer,Institution, NewInstitution,Supplier(Former), Supplier(Trader),ShopManager, Distrubuter,     
        'Status', // Active / Deactive 
        'BranchID',
        'RoleID',  // newly added          
        'created_by',
        'updated_by',
    ];

    protected $hidden = [
        'Password',
    ];


    public function role()
    {
        return $this->belongsTo(RoleModel::class, 'RoleID', 'RoleID');
    }
    public function branch()
    {
        return $this->belongsTo(BranchModel::class, 'BranchID', 'BranchID');
    }

    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function deliveryAddresses()
    {
        return $this->hasMany(DeliveryAddressModel::class, 'UserID', 'UserID');
    }

    public function orderList()
    {
        return $this->hasMany(OrderModel::class, 'ClientID', 'UserID');
    }
    public function admin()
    {
        return $this->hasOne(AdminModel::class, 'UserID', 'UserID');
    }
    public function customer()
    {
        return $this->hasOne(CustomerModel::class, 'UserID', 'UserID');
    }
    public function distributor()
    {
        return $this->hasOne(DistributorModel::class, 'UserID', 'UserID');
    }
    public function driver()
    {
        return $this->hasOne(DriverModel::class, 'UserID', 'UserID');
    }
    public function employee()
    {
        return $this->hasOne(EmployeeModel::class, 'UserID', 'UserID');
    }
    public function institution()
    {
        return $this->hasOne(InstitutionModel::class, 'UserID', 'UserID');
    }
    public function quickcommerce()
    {
        return $this->hasOne(QuickCommerceModel::class, 'UserID', 'UserID');
    }
    public function shopmanager()
    {
        return $this->hasOne(ShopManagerModel::class, 'UserID', 'UserID');
    }
}
