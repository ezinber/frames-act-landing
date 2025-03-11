import { Header } from "./header";
import { headerSelectors } from "./constants";
import { registerEzCarousel } from "../components/ez-carousel/ez-carousel";

// const header = new Header(headerSelectors);
registerEzCarousel();

document.addEventListener('DOMContentLoaded', () => {
  // header.init();
});
