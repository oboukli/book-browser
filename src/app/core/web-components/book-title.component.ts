import { BookInfo } from "../models";

const template = document.createElement("template");
template.innerHTML = `
<style>
  :host {
    display: inline-block;
  }
  /* TODO: Use the BEM naming convention. */
  .book {
    margin: 0.5em 1em;
  }
</style>
<div class="book">
<img id="bookCoverElmt" class="lazy-loaded" />
  <div class="book-info">
    <h4 id="titleElmt"></h4>
    <p id="authorElmt"></p>
    <p id="isbnElmt"></p>
    <p id="publisherElmt"></p>
  </div>
</div>
`;
export class BookTitle extends HTMLElement {
  private bookInfo: BookInfo;
  private titleElmt: HTMLElement;
  private authorElmt: HTMLElement;
  private isbnElmt: HTMLElement;
  private publisherElmt: HTMLElement;
  private bookCoverElmt: HTMLImageElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.titleElmt = this.shadowRoot.getElementById("titleElmt");
    this.authorElmt = this.shadowRoot.getElementById("authorElmt");
    this.isbnElmt = this.shadowRoot.getElementById("isbnElmt");
    this.publisherElmt = this.shadowRoot.getElementById("publisherElmt");

    this.bookCoverElmt = this.shadowRoot.getElementById(
      "bookCoverElmt"
    ) as HTMLImageElement;
  }

  static get observedAttributes(): string[] {
    return ["info"];
  }

  get info(): BookInfo {
    return this.bookInfo;
  }

  set info(val: BookInfo) {
    if (val) {
      this.bookInfo = val;

      this.update();
    }
  }

  private update(): void {
    this.titleElmt.textContent = this.bookInfo.title;
    this.authorElmt.textContent = this.bookInfo.author;
    this.isbnElmt.textContent = this.bookInfo.isbn;
    this.publisherElmt.textContent = this.bookInfo.publisher;

    this.bookCoverElmt.dataset.srcset = `${this.bookInfo.coverUris.large} 2x, ${
      this.bookInfo.coverUris.medium
    } 1x`;
    this.bookCoverElmt.dataset.src = this.bookInfo.coverUris.large;
    this.bookCoverElmt.alt = this.bookInfo.title;
    this.bookCoverElmt.title = this.bookInfo.title;
  }
}

window.customElements.define("book-title", BookTitle);
