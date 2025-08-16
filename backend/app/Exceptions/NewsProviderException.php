<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class NewsProviderException extends Exception
{
    private string $provider;

    public function __construct(string $provider, string $message, int $code = 0, ?Exception $previous = null)
    {
        $this->provider = $provider;
        $formattedMessage = "News Provider [{$provider}]: {$message}";

        parent::__construct($formattedMessage, $code, $previous);
    }

    public function getProvider(): string
    {
        return $this->provider;
    }
}
