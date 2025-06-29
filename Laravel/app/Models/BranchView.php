<?php

namespace App\Models;

class BranchView
{
    public string $Key;
    public string $BranchName;

    public function __construct(string $key, string $branchName)
    {
        $this->Key = $key;
        $this->BranchName = $branchName;
    }
}
