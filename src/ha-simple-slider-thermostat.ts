import { CSSResultGroup, LitElement, TemplateResult, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import * as packageData from '../package.json';

console.info(
    `%c  ${packageData.name.toUpperCase()} \n%c Version ${packageData.version} `,
    'color: white; font-weight: bold; background: rgb(137, 179, 248)',
    'color: black; font-weight: bold; background: rgb(245, 245, 245)',
);

@customElement("ha-simple-slider-thrmostat")
export class HaKeypadSelector extends LitElement {
    constructor() {
        super();
    }

    @property()
    public hass!: HomeAssistant;

    protected render(): TemplateResult {
        return html`
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
        `;
    }
}