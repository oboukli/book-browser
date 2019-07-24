import { BookInfo } from "../models";

// TODO: This should be configurable.
const baseApiUri = "https://openlibrary.org";
const baseBookCoverUri = "http://covers.openlibrary.org/b/isbn/";

export async function searchOpenLibrary(searchTerm: string): Promise<BookInfo> {
  const encodedTerm = encodeURIComponent(searchTerm);
  const uriStr = new URL(`search.json?q=${encodedTerm}`, baseApiUri).toString();

  const response = await fetch(uriStr);
  const data = await response.json();
  // TODO: This can be optimized.
  const entriesWithIsbn = data.docs.filter(d => d.isbn);
  return entriesWithIsbn.map(d => {
    return {
      author: d.author_name,
      coverUris: {
        large: getCoverUri(d.isbn[0], "L"),
        medium: getCoverUri(d.isbn[0], "M")
      },
      isbn: d.isbn && d.isbn.length ? d.isbn[0] : "",
      publisher: d.publisher && d.publisher.length ? d.publisher[0] : 0,
      title: d.title
    };
  });
}

function getCoverUri(isbn: string, size: "M" | "L"): string {
  return new URL(`${isbn}-${size}.jpg`, baseBookCoverUri).toString();
}
