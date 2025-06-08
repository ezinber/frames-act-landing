/**
 * The `EzCarousel` web component provides a simple and customizable carousel interface.
 *
 * @class EzCarousel
 * @extends HTMLElement
 */
class EzCarousel extends HTMLElement {
  /**
   * Constructs a new `EzCarousel` instance.
   *
   * @constructor
   */
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.content = document.getElementById('ez-carousel').content.cloneNode(true);
    this.content.querySelector('link').href=`${import.meta.resolve('./ez-carousel.css')}`;
    this.shadowRoot.appendChild(this.content);
    this.slides = this.shadowRoot.querySelector('slot').assignedElements();
    this.currentSlide = 0;
  }

  /**
   * Sets the current slide index.
   *
   * @param {number} index - The index of the slide to set as the current slide.
   * @memberof EzCarousel
   * @returns {void}
   */
  setCurrentSlide(index) {
    this.toggleButtonState(index, this.currentSlide)
    this.currentSlide = index;
  }

  /**
   * Toggles the disabled state of the navigation buttons.
   *
   * @param {number} newIndex - The index of the new slide.
   * @param {number} oldIndex - The index of the previous slide.
   * @memberof EzCarousel
   * @returns {void}
   */
  toggleButtonState(newIndex, oldIndex) {
    this.buttonsArr[newIndex].toggleAttribute('disabled');
    this.buttonsArr[oldIndex].toggleAttribute('disabled');
  }

  /**
   * Scrolls the carousel to the specified slide.
   *
   * @param {number} index - The index of the slide to scroll to.
   * @memberof EzCarousel
   * @returns {void}
   */
  handleScrollToSlide(index) {
    this.slides[index].scrollIntoView({ block: 'nearest', inline: 'start' });
  }

  /**
   * Defines the control buttons for the carousel.
   *
   * @memberof EzCarousel
   * @returns {void}
   */
  defineCtrlButtons() {
    this.ctrlButtons = this.shadowRoot.querySelector('.ctrl');
  }

  /**
   * Defines the navigation buttons for the carousel.
   *
   * @memberof EzCarousel
   * @returns {void}
   */
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

  /**
   * Handles the click event on the control buttons.
   *
   * @param {Event} evt - The click event object.
   * @memberof EzCarousel
   * @returns {void}
   */
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

  /**
   * Handles the click event on the navigation buttons.
   *
   * @param {Event} evt - The click event object.
   * @memberof EzCarousel
   * @returns {void}
   */
  handleNavButtonsClick = (evt) => {
    if (evt.target.classList.contains('btn-slide')) {
      const targetSlide = parseInt(evt.target.getAttribute('data-slide'));
      this.handleScrollToSlide(targetSlide);
    }
  }

  /**
   * Sets the event listeners for the carousel.
   *
   * @memberof EzCarousel
   * @returns {void}
   */
  setEventListeners() {
    this.ctrlButtons.addEventListener('click', this.handleCtrlButtonsClick);
    this.navButtons.addEventListener('click', this.handleNavButtonsClick);
  }

  /**
   * Sets up the IntersectionObserver to detect when slides come into view.
   *
   * @memberof EzCarousel
   * @returns {void}
   */
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

  /**
   * Called when the `EzCarousel` element is inserted into the DOM.
   *
   * @memberof EzCarousel
   * @returns {void}
   */
  connectedCallback() {
    this.defineCtrlButtons();
    this.defineNavButtons();
    this.setIntersectionObserver();
    this.setEventListeners();
  }
}

export const registerEzCarousel = () => customElements.define('ez-carousel', EzCarousel);
