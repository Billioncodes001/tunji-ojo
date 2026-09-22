import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`posts\` ADD \`updated_by_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`posts_updated_by_idx\` ON \`posts\` (\`updated_by_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_updated_by_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_by_idx\` ON \`_posts_v\` (\`version_updated_by_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_posts\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`slug\` text,
    \`excerpt\` text,
    \`category_id\` integer,
    \`author_id\` integer,
    \`archive_image\` text,
    \`cover_id\` integer,
    \`period\` text,
    \`takeaway\` text,
    \`correction\` text,
    \`related_page_route\` text DEFAULT 'story',
    \`related_page_title\` text DEFAULT 'Explore the public record',
    \`review_stage\` text DEFAULT 'draft',
    \`editor_notes\` text,
    \`owner_id\` integer,
    \`published_at\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft',
    FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`author_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_posts\`("id", "title", "slug", "excerpt", "category_id", "author_id", "archive_image", "cover_id", "period", "takeaway", "correction", "related_page_route", "related_page_title", "review_stage", "editor_notes", "owner_id", "published_at", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "excerpt", "category_id", "author_id", "archive_image", "cover_id", "period", "takeaway", "correction", "related_page_route", "related_page_title", "review_stage", "editor_notes", "owner_id", "published_at", "updated_at", "created_at", "_status" FROM \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts\` RENAME TO \`posts\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_category_idx\` ON \`posts\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_cover_idx\` ON \`posts\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_owner_idx\` ON \`posts\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__posts_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text,
    \`version_slug\` text,
    \`version_excerpt\` text,
    \`version_category_id\` integer,
    \`version_author_id\` integer,
    \`version_archive_image\` text,
    \`version_cover_id\` integer,
    \`version_period\` text,
    \`version_takeaway\` text,
    \`version_correction\` text,
    \`version_related_page_route\` text DEFAULT 'story',
    \`version_related_page_title\` text DEFAULT 'Explore the public record',
    \`version_review_stage\` text DEFAULT 'draft',
    \`version_editor_notes\` text,
    \`version_owner_id\` integer,
    \`version_published_at\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    \`autosave\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_author_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__posts_v\`("id", "parent_id", "version_title", "version_slug", "version_excerpt", "version_category_id", "version_author_id", "version_archive_image", "version_cover_id", "version_period", "version_takeaway", "version_correction", "version_related_page_route", "version_related_page_title", "version_review_stage", "version_editor_notes", "version_owner_id", "version_published_at", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_title", "version_slug", "version_excerpt", "version_category_id", "version_author_id", "version_archive_image", "version_cover_id", "version_period", "version_takeaway", "version_correction", "version_related_page_route", "version_related_page_title", "version_review_stage", "version_editor_notes", "version_owner_id", "version_published_at", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__posts_v\` RENAME TO \`_posts_v\`;`)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_category_idx\` ON \`_posts_v\` (\`version_category_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_author_idx\` ON \`_posts_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_cover_idx\` ON \`_posts_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_owner_idx\` ON \`_posts_v\` (\`version_owner_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_autosave_idx\` ON \`_posts_v\` (\`autosave\`);`)
}
