class EzCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.content = document.getElementById('ez-carousel').content.cloneNode(true);
    this.content.querySelector('link').href=`${import.meta.resolve('./ez-carousel.css')}`;
    this.shadowRoot.appendChild(this.content);
    this.slides = this.shadowRoot.querySelector('slot').assignedElements();
    this.currentSlide = 0;
  }

  setCurrentSlide(index) {
    this.toggleButtonState(index, this.currentSlide)
    this.currentSlide = index;
  }

  toggleButtonState(newIndex, oldIndex) {
    this.buttonsArr[newIndex].toggleAttribute('disabled');
    this.buttonsArr[oldIndex].toggleAttribute('disabled');
  }

  handleScrollToSlide(index) {
    this.slides[index].scrollIntoView({ block: 'nearest', inline: 'start' });
  }

  defineCtrlButtons() {
    this.ctrlButtons = this.shadowRoot.querySelector('.ctrl');
  }

  defineNavButtons() {
    this.navButtons = this.shadowRoot.querySelector('.nav');
    const navButtonContainer = this.navButtons.querySelector('li');
    this.buttonsArr = [ navButtonContainer.querySelector('.btn-slide') ];

    this.slides.forEach((item, index) => {
      if (index === 0) return;

      const listItem = navButtonContainer.cloneNode(true);
      const button = listItem.querySelector('.btn-slide');
      button.setAttribute('data-slide', index);
      this.navButtons.appendChild(listItem);
      this.buttonsArr.push(button);
    });

    this.buttonsArr[this.currentSlide].toggleAttribute('disabled');
  }

  handleCtrlButtonsClick = (evt) => {
      const firstSlide = 0;
      const lastSlide = this.slides.length - 1;
      let targetSlide = this.currentSlide;

      if (evt.target.classList.contains('btn-prev')) {
        targetSlide = targetSlide > firstSlide
          ? targetSlide - 1
          : lastSlide;
      } else if (evt.target.classList.contains('btn-next')) {
        targetSlide = targetSlide < lastSlide
          ? targetSlide + 1
          : firstSlide;
      }

      this.handleScrollToSlide(targetSlide);
  }

  handleNavButtonsClick = (evt) => {
    if (evt.target.classList.contains('btn-slide')) {
      const targetSlide = parseInt(evt.target.getAttribute('data-slide'));
      this.handleScrollToSlide(targetSlide);
    }
  }

  setEventListeners() {
    this.ctrlButtons.addEventListener('click', this.handleCtrlButtonsClick);
    this.navButtons.addEventListener('click', this.handleNavButtonsClick);
  }

  setIntersectionObserver() {
    const options = {
        root: this,
        rootMargin: '0px',
        threshold: .8
    };

    let debounceTimeout;

    const observer = new IntersectionObserver((entries) => {
      clearTimeout(debounceTimeout);

      entries.forEach(entry => {
        const targetSlide = this.slides.indexOf(entry.target);
        if (entry.isIntersecting && targetSlide !== this.currentSlide ) {
          this.setCurrentSlide(targetSlide);
        }
      });
    }, options);

    this.slides.forEach(slide => {
        observer.observe(slide);
    });
  }

  connectedCallback() {
    this.defineCtrlButtons();
    this.defineNavButtons();
    this.setIntersectionObserver();
    this.setEventListeners();
  }
}

export const registerEzCarousel = () => customElements.define('ez-carousel', EzCarousel);
