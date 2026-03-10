<?php

namespace App\Services\SuperAdmin;

use App\Repositories\SuperAdmin\SystemSettingRepository;

class SystemSettingService
{
    public function __construct(
        private readonly SystemSettingRepository $systemSettingRepository
    ) {
    }

    public function getAllSettings()
    {
        return $this->systemSettingRepository->getAllKeyValue();
    }

    public function upsertSettings(array $settings): void
    {
        $this->systemSettingRepository->upsertMany($settings);
    }
}
