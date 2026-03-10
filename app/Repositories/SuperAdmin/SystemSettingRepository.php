<?php

namespace App\Repositories\SuperAdmin;

use App\Models\SystemSetting;

class SystemSettingRepository
{
    public function getAllKeyValue()
    {
        return SystemSetting::query()
            ->get(['key', 'value'])
            ->mapWithKeys(fn ($setting) => [$setting->key => $setting->value]);
    }

    public function upsertMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => (string) $key],
                ['value' => is_null($value) ? null : (string) $value],
            );
        }
    }
}
