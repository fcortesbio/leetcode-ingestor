export type Difficulty = 'Easy' | 'Medium' | 'Hard'; // why not Difficulty: string

export interface LeetCodeQuestion {
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: Difficulty;
  isPaidOnly: boolean;
}

export interface GraphQLResponse {
  data: {
    problemsetQuestionList: {
      questions: LeetCodeQuestion[];
    };
  };
}
