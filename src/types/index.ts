export interface WritingProject {
  id: string;
  title: string;
  description: string;
  status: "In Progress" | "Completed" | "On Hold";
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  text: string;
  timestamp: string;
}

export interface DailyEntries {
  [date: string]: DiaryEntry[];
}

export interface BibleVerse {
  reference: string;
  text: string;
  verses: { book_id: string; book_name: string; chapter: number; verse: number; text: string }[];
}
