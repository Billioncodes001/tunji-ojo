import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`posts\` ADD \`telegram_submission_id\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_telegram_submission_id_idx\` ON \`posts\` (\`telegram_submission_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_telegram_submission_id\` text;`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_telegram_submission_id_idx\` ON \`_posts_v\` (\`version_telegram_submission_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`telegram_user_id\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_telegram_user_id_idx\` ON \`users\` (\`telegram_user_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`posts_telegram_submission_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`telegram_submission_id\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_version_version_telegram_submission_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_telegram_submission_id\`;`)
  await db.run(sql`DROP INDEX \`users_telegram_user_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`telegram_user_id\`;`)
}
