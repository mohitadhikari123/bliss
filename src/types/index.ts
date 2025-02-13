export interface Question {
  id: string;
  type: "SELECT_BUTTON" | "SUBMIT_BUTTON";
  text: string;
  options: {
    yes: string;
    no: string;
  };
}

export interface Page {
  id: string;
  slug: string;
  type: "HOME" | "SECOND" | "THIRD" | "ZERO" | "MBL" | "LOGIN";
  title: string;
  description?: string;
  questions: Question[];
}

export interface PageState {
  pages: Page[];
  currentPageIndex: number;
  answers: Record<string, string>;
}
export interface HomePageProps {
  page: Page;
  onContinue: () => void;
}
