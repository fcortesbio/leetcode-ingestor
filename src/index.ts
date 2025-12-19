import { LeetCodeService } from './leetcode.js';
import { LeetCodeDatabase } from './database.js';

async function main() {
  const db = new LeetCodeDatabase('leetcode_vault.db');
  const leetcode = new LeetCodeService();

  const BATCH_SIZE = 7;

  async function sync() {
    try {
      // 1. Initialize the database and check current state
      await db.initialize();
      const currentCount = await db.getProblemCount();
      console.log(`Current local database count: ${currentCount}`);

      // 2. Fetch the "Next" chunk of problems from LeetCode
      console.log(
        `Fetching next ${BATCH_SIZE} algoritms (offset: ${currentCount})...`,
      );
      const questions = await leetcode.fetchAlgorithmProblems(
        BATCH_SIZE,
        currentCount,
      );

      if (questions.length === 0) {
        console.log('No new problems found. Exiting...');
        return;
      }

      // 3. Persist to SQLite database
      await db.upsertQuestions(questions);

      // 4. Verification
      const newCount = await db.getProblemCount();
      console.log(
        `Succesfully ingested ${questions.length} problems. New total: ${newCount}`,
      );
    } catch (error) {
      console.error('Error syncing LeetCode problems:', error);
      process.exit(1);
    }
  }

  // Run the sync process
  await sync();
}

main().catch(console.error);
