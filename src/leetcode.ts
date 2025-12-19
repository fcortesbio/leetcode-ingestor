import type { LeetCodeQuestion, GraphQLResponse } from './types.js';

export class LeetCodeService {
  private readonly endpoint = 'https://leetcode.com/graphql';

  private readonly headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (LeetCode-Ingestor/1.0; fcortesbio)',
    Referer: 'https://leetcode.com/problemset/algorithms/',
  };

  /**
   * Fetches a chunk of algorithm-specific questions from LeetCode.
   * @param limit - Number of problems to retrieve
   * @param skip - Number of problems to skip
   */
  public async fetchAlgorithmProblems(
    limit: number,
    skip: number,
  ): Promise<LeetCodeQuestion[]> {
    const query = `
            query getProblemChunk($limit: Int, $skip: Int, $category: String) {
               problemsetQuestionList: questionList(
                    categorySlug: $category
                    limit: $limit
                    skip: $skip
                    filters: {}
               ) {
                questions: data {
                    questionFrontendId
                    title
                    titleSlug
                    difficulty
                    isPaidOnly
                }     
               }
            }
        `;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        query,
        variables: {
          limit,
          skip,
          category: 'algorithms',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch problems: ${response.status}`);
    }

    const result = (await response.json()) as GraphQLResponse;

    if (result.errors) {
      throw new Error(
        `GraphQL execution error: ${JSON.stringify(result.errors)}`,
      );
    }

    return result.data.problemsetQuestionList.questions;
  }
}
