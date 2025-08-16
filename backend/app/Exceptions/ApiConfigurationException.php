<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class ApiConfigurationException extends Exception
{
    public function __construct(string $service, string $configKey)
    {
        $message = "API configuration missing for {$service}. Please set {$configKey} in your environment file.";

        parent::__construct($message);
    }
}
