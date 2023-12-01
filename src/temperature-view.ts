import { CSSResultGroup, LitElement, PropertyValueMap, TemplateResult, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement("temperature-display")
export class TemperatureDisplay extends LitElement {

    @property({ type: Number })
    public value?: number;

    @property({ type: String })
    public units?: string;

    @property({type: Number})
    public precision: number = 1;

    @query("#canvas", true)
    private svgElement?: SVGGraphicsElement | null;

    static get styles(): CSSResultGroup {
        return css`
            #canvas {
                width: 100%;
                height: 100%;
            }

            #canvas text {
                fill: var(--text-color);
            }
        `;
    }

    protected render(): TemplateResult {
        return html`
            <svg viewBox="0,0,40,20" preserveAspectRatio="xMidYMid meet" id="canvas">
                <text x="0" y="0">
                    <tspan style="font-size: 13px">${this.value?.toFixed(this.precision) ?? "--"}</tspan>
                    <tspan dy="-6.5" dx="-4" style="font-size: 4px">${this.units ?? ""}</tspan>
                </text>
            </svg>
        `;
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        const resizeObserver = new ResizeObserver(() =>  this.resizeCanvas());
        resizeObserver.observe(this);
    }

    protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.resizeCanvas();
    }

    private resizeCanvas(): void {
        if(this.svgElement){
            var boundingBox = this.svgElement.getBBox();
            this.svgElement.setAttribute("viewBox", `${boundingBox.x} ${boundingBox.y} ${boundingBox.width} ${boundingBox.height}`);

            console.log(`SVG BBOX ${boundingBox}`);
        } else {
            console.log("SVG not available yet");
        }
    }
}