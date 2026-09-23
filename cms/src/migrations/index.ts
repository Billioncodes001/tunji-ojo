import * as migration_20260922_135852 from './20260922_135852';
import * as migration_20260922_140209 from './20260922_140209';
import * as migration_20260923_114615_telegram_publishing from './20260923_114615_telegram_publishing';

export const migrations = [
  {
    up: migration_20260922_135852.up,
    down: migration_20260922_135852.down,
    name: '20260922_135852',
  },
  {
    up: migration_20260922_140209.up,
    down: migration_20260922_140209.down,
    name: '20260922_140209',
  },
  {
    up: migration_20260923_114615_telegram_publishing.up,
    down: migration_20260923_114615_telegram_publishing.down,
    name: '20260923_114615_telegram_publishing'
  },
];
