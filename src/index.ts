import { LeetCodeService } from './leetcode.js';

const leetcode = new LeetCodeService();

async function main() {
  try {
    console.log('--- LeetCode GraphQL API ---');
    // Fetch a tiny chunk (2 problems) to minimize noise
    const questions = await leetcode.fetchAlgorithmProblems(2, 0);

    if (questions.length > 0) {
      console.log('Success! Received data from API:');
      console.table(questions); // Visualizes the array nicely in the terminal
    } else {
      console.warn('API returned successfully but questions array is empty.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
main().catch(console.error);

// async function test() {
//   await db.initialize();
//   console.log('DB Initialized.');

//   await db.upsertQuestions([
//     {
//       questionFrontendId: '1',
//       title: 'Two Sum',
//       titleSlug: 'two-sum',
//       difficulty: 'Easy',
//       isPaidOnly: false,
//     },
//   ]);
//   console.log('Mock data ingested.');
// }

// // test().catch(console.error);
