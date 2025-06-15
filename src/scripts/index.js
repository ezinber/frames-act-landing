import { headerSelectors } from "./constants.js";
// import { registerEzCarousel } from "../components/ez-carousel/ez-carousel.js";
import { registerEzDialog } from "../components/ez-dialog/ez-dialog.js";
import { Header } from "./header.js";

const header = new Header(headerSelectors);

// registerEzCarousel();
registerEzDialog();
header.init();
