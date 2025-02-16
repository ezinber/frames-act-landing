import { Header } from "./header";
import { headerSelectors } from "./constants";

const header = new Header(headerSelectors);

document.addEventListener('DOMContentLoaded', () => {
  header.init();
})