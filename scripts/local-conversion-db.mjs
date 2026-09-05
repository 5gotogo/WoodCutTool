import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
export function openConversionDb(path = ':memory:') {
  const sqlite = new DatabaseSync(path);
  sqlite.exec(readFileSync(new URL('../migrations/0001_conversion_daily.sql', import.meta.url), 'utf8'));
  return {
    close: () => sqlite.close(),
    prepare(sql) {
      return { bind(...values) {
        return {
          async run() { sqlite.prepare(sql).run(...values); return { success: true }; },
          async all() { return { success: true, results: sqlite.prepare(sql).all(...values) }; },
        };
      } };
    },
  };
}
