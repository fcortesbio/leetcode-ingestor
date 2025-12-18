import { LeetCodeDatabase } from './database.js';

const db = new LeetCodeDatabase('leetcode_vault.db');

async function test() {
  await db.initialize();
  console.log('DB Initialized.');

  await db.upsertQuestions([
    {
      questionFrontendId: '1',
      title: 'Two Sum',
      titleSlug: 'two-sum',
      difficulty: 'Easy',
      isPaidOnly: false,
    },
  ]);
  console.log('Mock data ingested.');
}

test().catch(console.error);
