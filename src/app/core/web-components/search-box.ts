import { searchOpenLibrary } from "../services/search-service";

const template = document.createElement("template");
// TODO: Use external HTML file.
template.innerHTML = `
<style>
  :host {
    display: inline;
  }
  .search-box, .search-box > form {
    display: inline;
  }
</style>
<div class="search-box">
  <form id="searchForm">
    <input
      id="searchBox"
      type="text"
      name="searchBox"
      class="search-txt"
      placeholder="Search in library"
      value="richard feynman"
    />
    <input type="submit" value="Search" />
    <input type="button" value="Clear" id="clearButton" />
  </form>
</div>
`;

export class SearchBox extends HTMLElement {
  private readonly searchBoxElementId = "searchBox";
  private readonly searchFormElementId = "searchForm";
  private searchBox: HTMLInputElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return ["value"];
  }

  public connectedCallback(): void {
    this.init();
  }

  public disconnectedCallback(): void {
    // TODO: Unsubscribe from events.
  }

  get value(): string {
    return this.searchBox.value;
  }

  set value(val: string) {
    if (val) {
      this.searchBox.value = val;
      this.search(val);
    }
  }

  private init(): void {
    const searchBox = this.shadowRoot.getElementById(
      this.searchBoxElementId
    ) as HTMLInputElement;
    if (!searchBox) {
      return; // TODO:
    }

    const clearButton = this.shadowRoot.getElementById(
      "clearButton"
    ) as HTMLInputElement;
    if (!clearButton) {
      return;
    }

    this.searchBox = searchBox;

    const form = this.shadowRoot.getElementById(this.searchFormElementId);
    if (!form) {
      return;
    }

    // TODO: Unsubscribe.
    form.addEventListener(
      "submit",
      event => {
        event.preventDefault();

        this.search(this.searchBox.value);
      },
      false
    );

    clearButton.addEventListener(
      "click",
      () => {
        this.searchBox.value = "";
      },
      false
    );
  }

  private async search(searchTerm: string): Promise<void> {
    try {
      const result = await searchOpenLibrary(searchTerm);
      // TODO: Document event name because
      // this is part of the public interface of the component.
      this.dispatchEvent(new CustomEvent("searchresult", { detail: result }));
    } catch (error) {
      console.error(error);
    }
  }
}

window.customElements.define("search-box", SearchBox);
