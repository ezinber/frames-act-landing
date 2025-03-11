class EzCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.content = document.getElementById('ez-carousel').content.cloneNode(true);
    this.content.querySelector('link').href=`${import.meta.resolve('./ez-carousel.css')}`;
    this.shadowRoot.appendChild(this.content);
  }

  handleCtrlButtonsClick() {
    this.ctrlButtons = this.shadowRoot.querySelector('.ctrl');

    this.ctrlButtons.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('btn-prev')) {
        if (this.currentSlide > 0) {
          this.currentSlide -= 1;
        } else {
          this.currentSlide = this.slides.length - 1;
        }
      } else if (evt.target.classList.contains('btn-next')) {
        if (this.currentSlide < this.slides.length - 1) {
          this.currentSlide += 1;
        } else {
          this.currentSlide = 0;
        }
      }

      this.slides[this.currentSlide].scrollIntoView({ block: 'nearest', inline: 'start' });
    })
  }

  setIntersectionObserver() {
    const options = {
        root: this, // Использовать viewport как корень
        rootMargin: '0px',
        threshold: 1 // 100% видимости
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.currentSlide = this.slides.indexOf(entry.target);
          console.log('Текущий слайд:', this.currentSlide);
        }
      });
    }, options);

    this.slides.forEach(slide => {
        observer.observe(slide);
    });
  }

  connectedCallback() {
    this.slides = this.shadowRoot.querySelector('slot').assignedElements();
    this.currentSlide = this.slides[0];

    this.handleCtrlButtonsClick();
    this.setIntersectionObserver();
  }
}

export const registerEzCarousel = () => customElements.define('ez-carousel', EzCarousel);
