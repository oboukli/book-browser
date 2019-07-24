import { BookInfo } from "./core/models";
import "./core/web-components/book-title.component";
import { BookTitle } from "./core/web-components/book-title.component";
import "./core/web-components/search-box";
import { SearchBox } from "./core/web-components/search-box";
import "./core/web-components/speech-recognizer.component";
import "./core/web-components/super-marquee.component";
import { SuperMarquee } from "./core/web-components/super-marquee.component";

let searchBoxElmt: SearchBox;
let bookCarouselElmt: SuperMarquee;
let bookCarouselSlot: HTMLSlotElement;
let relativeTimeElmt: HTMLElement;

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init(): void {
  bookCarouselElmt = document.getElementById("bookCarousel") as SuperMarquee;
  bookCarouselSlot = document.getElementById(
    "bookCarouselSlot"
  ) as HTMLSlotElement;

  relativeTimeElmt = document.getElementById("relativeTime");

  searchBoxElmt = document.getElementById("searchBox") as SearchBox;

  searchBoxElmt.addEventListener("searchresult", handleSearchResult, false);

  document
    .getElementById("speechRecognizer")
    .addEventListener("recognizedtext", handleVoiceCommand, false);

  document.addEventListener("visibilitychange", handleVisibilityChanged, false);
}

function handleSearchResult(event): void {
  updateRelativeTime();

  bookCarouselElmt.pause();
  updateBookCarousel(event.detail);
  setupLazyLoading();
  bookCarouselElmt.play();
}

function handleVoiceCommand(event): void {
  searchBoxElmt.value = event.detail;
}

function updateRelativeTime(): void {
  relativeTimeElmt.textContent = new Date().toLocaleString("default");
}

function updateBookCarousel(books: BookInfo[]): void {
  const fragment = document.createDocumentFragment();
  let element: BookTitle;
  if (books) {
    books.forEach((book: BookInfo) => {
      element = document.createElement("book-title") as BookTitle;
      element.info = book;
      fragment.appendChild(element);
    });

    while (bookCarouselSlot.lastChild) {
      bookCarouselSlot.removeChild(bookCarouselSlot.lastChild);
    }

    bookCarouselSlot.appendChild(fragment);
  }
}

function setupLazyLoading() {
  // TODO: Has data-src and not data-loaded--Decouple, no need for extra class,
  // or pass class to component.
  const lazyImages = getLazyImages();
  if ("IntersectionObserver" in window) {
    const lazyImageObserver = new IntersectionObserver(entries => {
      let lazyImage;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lazyImage = entry.target as HTMLImageElement;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy-loaded"); // TODO: Add data-loaded.
          lazyImageObserver.unobserve(lazyImage);
          preloadImages();
        }
      });
    });
    lazyImages.forEach(lazyImage => {
      lazyImageObserver.observe(lazyImage);
    });
  }
}

function handleVisibilityChanged() {
  if (document.hidden) {
    document.title = "Paused";
    bookCarouselElmt.pause();
  } else {
    document.title = "Playing";
    bookCarouselElmt.play();
  }
}

function preloadImages(): void {
  // TODO: preload some images.
  return;
}

function getLazyImages(): HTMLImageElement[] {
  let lazyImages: HTMLImageElement[] = [];
  const bookTitleElements = document.querySelectorAll("#bookCarouselSlot > book-title");
  bookTitleElements.forEach(e => {
    const shadowLazyImages = [].slice.call(
      e.shadowRoot.querySelectorAll("img.lazy-loaded")
    );

    lazyImages = [...lazyImages, ...shadowLazyImages];
  });

  return lazyImages;
}
