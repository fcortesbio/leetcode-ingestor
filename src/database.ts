import sqlite3 from 'sqlite3';
import type { LeetCodeQuestion } from './types.js';

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
            question.questionFrontendId,
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
