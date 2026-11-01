export interface SearchDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number | string;
  ebook_access?: string;
  subject?: string[] | string;
}

export interface SearchResponse {
  docs?: SearchDoc[];
  numFound?: number;
}

export interface WorkAuthor {
  name?: string;
  author?: { name?: string };
}

export interface WorkDoc {
  key?: string;
  title?: string;
  description?: string | { value?: string };
  covers?: Array<number | string>;
  subjects?: string[] | string;
  subject?: string[] | string;
  authors?: Array<string | WorkAuthor>;
  first_publish_date?: string;
  first_publish_year?: number;
  ebook_access?: string;
}
