<?php

declare(strict_types=1);

namespace App\Enums;

enum NewsStrategy: string
{
    case THE_GUARDIAN = 'The Guardian';
    case GENERAL = 'General';
    case NY_TIMES = 'New York Times';
    case NEWS_ORG = 'NewsOrg';
    case CREATED_AT = 'created_at';
    case UPDATED_AT = 'updated_at';
}
