const template = document.createElement("template");
template.innerHTML = `
<style>
  :host, .container {
    display: inline;
  }
</style>
<div class="container">
  <button id="dictateButton">voice search</button>
</div>
`;

export class SpeechRecognizer extends HTMLElement {
  private readonly dictateButtonElementId = "dictateButton";
  private readonly listeningIsOffButtonLabel = "Start dictation";
  private readonly listeningIsOnButtonLabel = "Stop dictation";
  private dictateButton: HTMLButtonElement;
  private recognition: any;

  private recognizedText = "";
  private isRecognizing = false;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  public connectedCallback(): void {
    this.init();
    this.initRecognition();
  }

  public disconnectedCallback(): void {
    // TODO: Unsubscribe from events.
  }

  private init(): void {
    const dictateButton = this.shadowRoot.getElementById(
      this.dictateButtonElementId
    ) as HTMLButtonElement;
    if (!dictateButton) {
      return;
    }

    this.dictateButton = dictateButton;
    this.dictateButton.textContent = this.listeningIsOffButtonLabel;

    // TODO: Unsubscribe.
    this.dictateButton.addEventListener(
      "click",
      event => {
        this.startListening();
      },
      false
    );
  }

  private initRecognition(): void {
    const SpeechRecognition: any =
      window["SpeechRecognition"] || window["webkitSpeechRecognition"];
    if (!SpeechRecognition) {
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1; // TODO:

    this.recognition.addEventListener("start", () => {
      this.isRecognizing = true;
    });

    this.recognition.addEventListener("end", () => {
      this.isRecognizing = false;

      if (!this.recognizedText) {
        return;
      }
    });

    this.recognition.addEventListener("result", event => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          this.recognizedText += event.results[i][0].transcript;
        }
      }

      this.dispatchEvent(
        new CustomEvent("recognizedtext", { detail: this.recognizedText })
      );
    });

    this.recognition.addEventListener("error", event => {
      console.error(event.error);
    });
  }

  private startListening(): void {
    this.toggleButton();

    if (this.isRecognizing) {
      this.recognition.stop();

      return;
    }

    this.recognizedText = "";
    // recognition.lang = "en-US"; // TODO:
    this.recognition.start();
  }

  private toggleButton(): void {
    if (this.isRecognizing) {
      this.dictateButton.textContent = this.listeningIsOffButtonLabel;
    } else {
      this.dictateButton.textContent = this.listeningIsOnButtonLabel;
    }
  }
}

window.customElements.define("speech-recognizer", SpeechRecognizer);
