import sqlite3 from 'sqlite3';
import type { LeetCodeQuestion } from './types.js';

// Standardize to 4-digit padding for 3363+ problems
const paddedId = (rawId: string) => {
  return String(rawId).padStart(4, '0');
};

export class LeetCodeDatabase {
  private database: sqlite3.Database;

  constructor(databasePath: string) {
    this.database = new sqlite3.Database(databasePath);
  }

  public async initialize(): Promise<void> {
    const schema = `
            CREATE TABLE IF NOT EXISTS problems (
                id TEXT PRIMARY KEY, 
                title TEXT NOT NULL, 
                slug TEXT NOT NULL, 
                difficulty TEXT NOT NULL, 
                is_paid_only BOOLEAN NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending'
            );
        `;
    return new Promise((resolve, reject) => {
      this.database.run(schema, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  public async getProblemCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      // Added 'AS count' so the result object has a property named 'count'
      this.database.get(
        'SELECT COUNT(*) AS count FROM problems',
        (err, row) => {
          if (err) return reject(err);

          // Now row is { count: X }
          const result = row as { count: number } | undefined;
          resolve(result?.count || 0);
        },
      );
    });
  }

  public async upsertQuestions(questions: LeetCodeQuestion[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.database.serialize(() => {
        this.database.run('BEGIN TRANSACTION');

        const statement = this.database.prepare(
          `INSERT OR IGNORE INTO problems (id, title, slug, difficulty, is_paid_only)
           VALUES (?, ?, ?, ?, ?)`,
        );

        for (const question of questions) {
          statement.run([
            paddedId(question.questionFrontendId),
            question.title,
            question.titleSlug,
            question.difficulty,
            question.isPaidOnly,
          ]);
        }

        statement.finalize();

        this.database.run('COMMIT', (err) => {
          err ? reject(err) : resolve();
        });
      });
    });
  }
}
