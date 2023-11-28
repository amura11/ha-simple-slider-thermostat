import { CSSResultGroup, LitElement, PropertyValueMap, TemplateResult, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { ClimateEntity } from './ha-types';
import * as packageData from '../package.json';
import { SliderStyles } from './styles';
import NoUiSlider, { PipsMode, PipsType, API as SliderInstance, Options as SliderOptions } from 'nouislider';
import { debounce } from 'lodash';

console.info(
    `%c  ${packageData.name.toUpperCase()} \n%c Version ${packageData.version} `,
    'color: white; font-weight: bold; background: rgb(137, 179, 248)',
    'color: black; font-weight: bold; background: rgb(245, 245, 245)',
);

interface SimpleSliderConfig extends LovelaceCardConfig {
    entity: string
    precision?: number
}

enum ThermostatDataResultType {
    Unknown,
    Success,
    EntityNotFound,
    NotConnected,
    NotConfigured
}

interface ThermostatDataResult {
    type: ThermostatDataResultType
    currentTemp?: number
    currentMode?: string
    currentPreset?: string
}

function filterPips(value: number, type: PipsType): PipsType {
    var toReturn: PipsType = PipsType.None;

    if (Number.isInteger(value) == true) {
        toReturn = PipsType.LargeValue;
    } else if ((value * 10) % 2 == 0) {
        toReturn = PipsType.NoValue;
    }

    return toReturn;
}

@customElement("simple-slider-thermostat")
export class SimpleSliderThermostat extends LitElement {
    constructor() {
        super();

        this._sliderConfig = {
            margin: 1,
            step: 0.1,
            range: { min: 17.8, max: 28.2 },
            padding: 0.2,
            start: [this._tempLow, this._tempHigh],
            pips: { mode: PipsMode.Steps, density: 1, filter: filterPips }
        }
    }

    @state()
    private _tempLow: number = 21.0;

    @state()
    private _tempHigh: number = 23.0;

    @state()
    private _hass?: HomeAssistant;

    @state()
    private _config?: SimpleSliderConfig;

    private _sliderElement?: HTMLElement;
    private _sliderInstance?: SliderInstance;
    private _sliderConfig!: SliderOptions;
    private _currentTempElement?: HTMLElement;

    public set hass(hass: HomeAssistant) {
        this._hass = hass;
    }

    public setConfig(config: SimpleSliderConfig): void {
        if (!config) {
            throw "Configuration is invalid";
        }

        this._config = config;
    }

    protected get precision(): number {
        return this._config?.precision ?? 1;
    }

    protected render(): TemplateResult {
        const thermostatData: ThermostatDataResult = this.getThermostatData();
        const temperatureUnit: string = this._hass!.config.unit_system.temperature;

        return html`
        <ha-card>
            <div class="container">
                <div class="display-container">
                    ${ this.renderTemperatureDisplay(thermostatData.currentTemp!.toFixed(this.precision), temperatureUnit) }
                </div>
                <div class="target-container">
                    <div class="temp-low">
                        ${this.renderTemperatureDisplay(this._tempLow.toFixed(this.precision), temperatureUnit)}
                    </div>
                    <div>ICON</div>
                    <div class="temp-low">
                        ${this.renderTemperatureDisplay(this._tempHigh.toFixed(this.precision), temperatureUnit)}
                    </div>
                </div>
                <div class="control-container">
                    <div id="slider-control"></div>
                </div>
            </div>
        </ha-card>
        `;
    }

    protected firstUpdated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this._sliderElement = this.shadowRoot!.getElementById("slider-control") as HTMLElement;
        this._sliderInstance = NoUiSlider.create(this._sliderElement, this._sliderConfig);

        this._sliderInstance.on("update", (values: (number | string)[]) => this.onSliderUpdate(values));
    }

    private getThermostatData(): ThermostatDataResult {
        const toReturn: ThermostatDataResult = {
            type: ThermostatDataResultType.Unknown
        };

        if (!this._config || !this._hass) {
            toReturn.type = ThermostatDataResultType.NotConfigured;
        } else if (!this._hass.connected) {
            toReturn.type = ThermostatDataResultType.NotConnected;
        } else {
            var entityState: ClimateEntity | undefined = this._hass.states[this._config!.entity] as ClimateEntity;

            if (entityState) {
                toReturn.type = ThermostatDataResultType.Success;
                toReturn.currentTemp = entityState.attributes.current_temperature;

                console.log(entityState.state);
            } else {
                toReturn.type = ThermostatDataResultType.EntityNotFound;
            }
        }

        return toReturn;
    }

    private renderTemperatureDisplay(temperatureValue: string, temperatureUnit: string) {
        return html`
        <svg class="temperature-display" viewBox="0 0 40 20">
            <text x="50%" dx="1" y="60%" text-anchor="middle" style="font-size: 13px">
                ${temperatureValue}
                <tspan dx="-3" dy="-6.5" style="font-size: 4px">${temperatureUnit}</tspan>
            </text>
        </svg>
        `
    }

    private async onSliderUpdate(values: (number | string)[]): Promise<void> {
        const newTempLow = parseFloat(values[0] as string);
        const newTempHigh = parseFloat(values[1] as string);

        if (newTempLow != this._tempLow || newTempHigh != this._tempHigh) {
            this._tempLow = newTempLow;
            this._tempHigh = newTempHigh;

            this.updateHomeAssistantEntity();
        }
    }

    private updateHomeAssistantEntity = debounce(async () => {
        var data = {
            entity_id: this._config!.entity,
            target_temp_low: this._tempLow,
            target_temp_high: this._tempHigh
        };

        console.log("Update HA entity");

        await this._hass!.callService("climate", "set_temperature", data);

        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

    }, 500);

    static get styles(): CSSResultGroup {
        return [SliderStyles, css`
            :host {

                --slider-background: var(--hast-slider-color, var(--paper-slider-container-color, #d3d3d3));
                --slider-height: var(--hast-slider-height, 4px);
                --slider-handle-size: var(--hast-handle-size, 32px);
                --slider-handle-color: var(--hast-handle-color, var(--paper-slider-active-color, rgb(3, 169, 244)));
                --slider-pips-small-height: var(--hast-pips-small-height, 5px);
                --slider-pips-large-height: var(--hast-pips-large-height, 15px);
                --slider-pips-text-size: var(--hast-pips-text-size, 17px);
                --slider-pips-v-spacing: var(--hast-pips-v-spacing, 8px);

                --slider-handle-h-offset: calc(var(--slider-handle-size) / 2);
                --slider-handle-v-offset: calc((var(--slider-handle-size) - var(--slider-height)) / 2);
                --slider-vertical-spacing: calc(var(--slider-handle-v-offset) + 2px);
                --slider-pips-height: calc(var(--slider-pips-large-height) + (var(--slider-pips-text-size) / 2));
                --slider-container-height: calc(var(--slider-pips-height) + var(--slider-handle-size) + 4px);
            }

            .container {
                display: flex;
                flex-direction: column;
                line-height: normal;
                aspect-ratio: 1/1;
                width: 100%;
                min-height: 100%;
                overflow: hidden;
            }

            .display-container {
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2em 5em;
            }

            .control-container {
                height: var(--slider-container-height);
                margin: var(--slider-pips-v-spacing) 0px;
            }

            .temperature-display {
                width: 100%;
                height: 100%;
            }

            .temperature-display text {
                fill: var(--primary-text-color);
            }

            .temp-current {
                flex-grow: 1;
            }

            .target-container {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                text-align: center;
            }

            .temp-low, .temp-high {
                height: 4rem;
                width: 40%;
            }

            .noUi-target.noUi-horizontal {
                height: var(--slider-height);
                margin-top: var(--slider-vertical-spacing);
                border-radius: 0px;
                border: none;
                box-shadow: none;
            }

            .noUi-horizontal .noUi-handle {
                width: var(--slider-handle-size);
                height: var(--slider-handle-size);
                top: calc(0px - var(--slider-handle-v-offset));
                right: calc(0px - var(--slider-handle-h-offset));
                border-radius: 100%;
                background: var(--slider-handle-color);
                box-shadow: none;
                border: none;
            }

            .noUi-horizontal .noUi-handle::before,
            .noUi-horizontal .noUi-handle::after {
                all: unset;
            }

            .noUi-horizontal .noUi-pips {
                padding: var(--slider-vertical-spacing) 0px 0px 0px;
                height: var(--slider-pips-height);
            }

            .noUi-pips .noUi-marker.noUi-marker-normal {
                height: var(--slider-pips-small-height);
            }

            .noUi-pips .noUi-marker.noUi-marker-large {
                height: var(--slider-pips-large-height);
            }
        `];
    }
}

//customElements.define("simple-slider-thermostat", SimpleSliderThermostat);