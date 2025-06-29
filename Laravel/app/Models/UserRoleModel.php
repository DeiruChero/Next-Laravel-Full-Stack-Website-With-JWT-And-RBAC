<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRoleModel extends Model
{
    use HasFactory;
     // Specify the table if it's not the plural of the model name
     protected $table = 'UserRoleModel';
     protected $primaryKey = 'UserRoleID'; // Specify your primary key here
     // Define the fillable properties
     protected $fillable = [
         'UserRoleID',
         'NewUserCreate', // not null
         'NewShopManagerCreate', 
         'ItemCreation', // primary id (customer)
         'ItemPackSize', // secondry id  ( institution)
         'ItemUnit', // Admin,Customer,Institution, NewInstitution,Supplier(Former), Supplier(Trader),ShopManager, Distrubuter,         
         'ItemPrice',
         'GenerateReports',
         'OrderStatus',
         'PandLReport',
         'CashFlowReport', 
         'SalaryPayment', 
         'Inventoy',         
     ];
}
