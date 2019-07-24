export interface BookInfo {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  coverUris: {
    medium: string;
    large: string;
  };
}
