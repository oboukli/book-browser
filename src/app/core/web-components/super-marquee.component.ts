const template = document.createElement("template");
template.innerHTML = `
<style>
  :host {
    display: block;
  }

  .super-marquee {
    margin: 0 auto;
    position: relative;
    display: inline-block;
    white-space: nowrap;
  }

  #slider {
    position: absolute;
    height: 100%;
    margin: 0;
    display:inline-block;

    text-indent: 0;

    transform:translateX(100%);
    /* TODO: Create programmatically. Calculate duration */
    animation: super-marquee 60s linear infinite;
  }

  .paused, #slider:hover {
    animation-play-state: paused
  }

  @keyframes super-marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>
<div class="super-marquee">
  <div id="slider"><slot id="contentSlot" name="content"></slot></div>
</div>
`;

export class SuperMarquee extends HTMLElement {
  private slider: HTMLElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.play = this.play.bind(this); // TODO:
    this.pause = this.pause.bind(this); // TODO:
  }

  public play(): void {
    this.slider.style.animationPlayState = "running";
  }

  public pause(): void {
    this.slider.style.animationPlayState = "paused";
  }

  public connectedCallback(): void {
    this.slider = this.shadowRoot.getElementById("slider");
  }
}

window.customElements.define("super-marquee", SuperMarquee);
