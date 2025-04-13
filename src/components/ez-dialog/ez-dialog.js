class EzDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.content = document.getElementById('ez-dialog').content.cloneNode(true);
    this.content.querySelector('link').href=`${import.meta.resolve('./ez-dialog.css')}`;
    this.shadowRoot.appendChild(this.content);
    this.dialogOpenButton = this.shadowRoot.querySelector('button');
    this.dialog = this.shadowRoot.querySelector('dialog');
  }

  connectedCallback() {
    this.dialogOpenButton.addEventListener('click', () => this.dialog.showModal());

    this.dialog.addEventListener('click', (evt) => {
      if (evt.target === this.dialog) this.dialog.close();
    });
  }
}

export const registerEzDialog = () => customElements.define('ez-dialog', EzDialog);
