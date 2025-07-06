export interface Question {
  id: string;
  word: string;
  image_urls: string[];
}

export interface Game {
    id: string;
    user_id: string;
    name: string;
    question_ids: string[];
}
