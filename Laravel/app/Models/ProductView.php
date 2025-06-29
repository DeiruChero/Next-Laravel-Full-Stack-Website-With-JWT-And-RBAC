<?php
namespace App\Models;
class ProductView
{
    public string $Key; // encrypted
    public string $Filter; // encrypted
    public string $ProductName;
    public string $ProductHindiName;
    public string $ProductUnicodeName;
    public string $UnitName; 
    public int $Quantity;  
    public float $Price;  
    public string $Picture;
    public float $Facter;

    public function __construct(
        string $key, 
        string $filter, 
        string $productName,
        string $productHindiName, 
        string $productUnicodeName, 
        string $unitName, 
        int $quantity, 
        float $price, 
        string $picture, 
        float $Facter = 0.0)  
    {
        $this->Key = $key;
        $this->Filter = $filter;
        $this->ProductName = $productName;
        $this->ProductHindiName = $productHindiName;
        $this->ProductUnicodeName = $productUnicodeName;
        $this->UnitName = $unitName;
        $this->Quantity = $quantity;
        $this->Price = $price;
        $this->Picture = $picture;
        $this->Facter = $Facter;
    }
}
