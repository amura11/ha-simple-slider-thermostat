import { CSSResultGroup, LitElement, TemplateResult, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig, handleAction } from 'custom-card-helpers';
import * as packageData from '../package.json';

console.info(
    `%c  ${packageData.name.toUpperCase()} \n%c Version ${packageData.version} `,
    'color: white; font-weight: bold; background: rgb(137, 179, 248)',
    'color: black; font-weight: bold; background: rgb(245, 245, 245)',
);

interface SimpleSliderConfig extends LovelaceCardConfig {
    entity: string
}

@customElement("simple-slider-thermostat")
export class SimpleSliderThermostat extends LitElement {
    constructor() {
        super();
    }

    @property()
    private _hass?: HomeAssistant;

    @property()
    private _config?: SimpleSliderConfig;

    public set hass(hass: HomeAssistant) {
        this._hass = hass;
    }

    public setConfig(config: SimpleSliderConfig) : void {
        if(!config){
            throw "Configuration is invalid";
        }

        this._config = config;
    }

    protected render(): TemplateResult {
        return html`
            <div class="hasst-container">
                <div class="hasst-temp-low">Lo</div>
                <div class="hasst-temp-current">Current</div>
                <div class="hasst-temp-high">high</div>
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`

            .hasst-container {
                display: flex;
                flex-direction: row;
            }
        `;
    }
}

//customElements.define("simple-slider-thermostat", SimpleSliderThermostat);