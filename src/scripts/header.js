/**
 * Class representing a Header with a burger menu and anchor link highlights.
 */
export class Header {
  /**
   * Create a Header instance.
   * @param {Object} options - The options for the header configuration.
   * @param {string} options.headerSelector - The CSS selector for the header element.
   * @param {string} options.headerExtendedClass - The class to apply to the header when the burger menu is opened.
   * @param {string} options.burgerSelector - The CSS selector for the burger menu element.
   * @param {string} options.burgerOpenedClass - The class to apply to the burger menu when it is opened.
   * @param {string} options.linkActiveClass - The class to apply to a link when its corresponding section is in view.
   */
  constructor({
    headerSelector,
    headerExtendedClass,
    burgerSelector,
    burgerOpenedClass,
    linkActiveClass
  }) {
    this.headerSelector = headerSelector;
    this.headerExtendedClass = headerExtendedClass;
    this.burgerSelector = burgerSelector;
    this.burgerOpenedClass = burgerOpenedClass;
    this.linkActiveClass = linkActiveClass;
    this.linksAndTargets = [];
  }

  /**
   * Collects all anchor links inside the header and maps them to their target sections.
   * @private
   */
  _collectLinks() {
    const links = this.headerElement.querySelectorAll('a[href^="#"]');

    // Result array to store the link and target objects
    this.linksAndTargets = [];

    links.forEach(link => {
      const href = link.getAttribute('href');
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);

      // Only add to result if the target element exists
      if (targetElement) {
        this.linksAndTargets.push({
          link: link,     // Link element
          target: targetElement  // Target element with the corresponding ID
        });
      }
    });
  }

  /**
   * Checks if the provided element is fully or partially in the viewport.
   * @param {HTMLElement} el - The target element to check.
   * @returns {boolean} - Whether the element is in the viewport or not.
   * @private
   */
  _isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    const isFullyVisible = rect.top >= 0 && rect.bottom <= windowHeight;
    const isPartiallyVisible = (rect.top < windowHeight / 2 && rect.bottom >= windowHeight / 2) || (rect.top >= 0 && rect.top < windowHeight / 2);

    return isFullyVisible || isPartiallyVisible;
  }

  /**
   * Handles scroll events to highlight anchor links whose target sections are visible.
   * @private
   */
  _handleLinksScroll() {
    this.linksAndTargets.forEach(i => {
      const { link, target } = i;

      if (this._isElementInViewport(target)) {
        link.classList.add(this.linkActiveClass);
      } else {
        link.classList.remove(this.linkActiveClass);
      }
    });
  }

  /**
   * Toggles the burger menu and header classes when the burger menu is clicked.
   * @private
   */
  _handleBurgerMenuClick() {
    this.headerElement.classList.toggle(this.headerExtendedClass);
    this.burgerElement.classList.toggle(this.burgerOpenedClass);
  }

  /**
   * Sets up event listeners for the burger menu and window scroll events.
   * @private
   */
  _setupEventListeners() {
    this.burgerElement.addEventListener('click', this._handleBurgerMenuClick.bind(this));
    window.addEventListener('scroll', this._handleLinksScroll.bind(this));
  }

  /**
   * Initializes the header by setting elements and setting up event listeners.
   * @public
   */
  init() {
    this.headerElement = document.querySelector(this.headerSelector);
    this.burgerElement = this.headerElement.querySelector(this.burgerSelector);

    this._collectLinks();
    this._setupEventListeners();
  }
}
