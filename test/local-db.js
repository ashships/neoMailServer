// D1-compatible test adapter backed by SQLite; no network listener required.
import { DatabaseSync } from 'node:sqlite';
export function database(schema) {
 const sqlite = new DatabaseSync(':memory:'); sqlite.exec(schema);
 function prepare(sql, params = []) {
  return {
   bind(...values) { return prepare(sql, values); },
   async first(column) { const row=sqlite.prepare(sql).get(...params); return row ? column ? row[column] : {...row} : null; },
   async all() { return {results:sqlite.prepare(sql).all(...params).map(row=>({...row}))}; },
   async run() { return sqlite.prepare(sql).run(...params); },
  };
 }
 return {prepare, async batch(statements) { sqlite.exec('BEGIN'); try { const result=[]; for(const statement of statements) result.push(await statement.all()); sqlite.exec('COMMIT'); return result; } catch(e) { sqlite.exec('ROLLBACK'); throw e; } },close(){sqlite.close();}};
}
