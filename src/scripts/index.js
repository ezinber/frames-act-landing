import { headerSelectors } from "./constants.js";
import { registerEzCarousel } from "../components/ez-carousel/ez-carousel.js";
import { Header } from "./header.js";

const header = new Header(headerSelectors);
registerEzCarousel();

document.addEventListener('DOMContentLoaded', () => {
  header.init();
});
