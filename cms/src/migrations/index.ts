import * as migration_20260922_135852 from './20260922_135852';
import * as migration_20260922_140209 from './20260922_140209';

export const migrations = [
  {
    up: migration_20260922_135852.up,
    down: migration_20260922_135852.down,
    name: '20260922_135852',
  },
  {
    up: migration_20260922_140209.up,
    down: migration_20260922_140209.down,
    name: '20260922_140209'
  },
];
