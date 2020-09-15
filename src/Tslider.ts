import Model from './model/Model'
import { ModelEvents } from './model/ModelEvents'
import ModelEventsHandler from './ModelEventsHandler'
import { Orientation } from './utils/aliases'
import {
  OrientationOption,
  OrientationOptions,
} from './utils/OrientationOptions'
import View from './view/View'
import './plugin.scss'

class Tslider {
  private view: View
  private model: Model
  private handler: ModelEventsHandler

  constructor({
    targetInput,
    from,
    to,
    max,
    min,
    step,
    orientation,
    showRuler = false,
    rulerSteps = 4,
    isRulerClickable = true,
    showLabels = true,
    inputValuesSeparator = ',',
  }: TsliderParams) {
    this.view = new View({
      orientationOption: this.getOrientationOption(orientation),
      targetInput,
      showLabels,
      showRuler,
      isRulerClickable,
      inputValuesSeparator,
    })

    const values = [from, ...(to !== undefined ? [to] : [])]
    this.model = new Model({
      max,
      min,
      step,
      rulerSteps,
      values,
      trackWidth: this.view.getTrackWidth(),
      trackHeight: this.view.getTrackHeight(),
      inputValuesSeparator,
    })

    this.handler = new ModelEventsHandler(this.view)
    this.model.attach(this.handler)

    this.model.notify(ModelEvents.Init)
  }

  setValues(from: number, to?: number): void {
    this.model.updateFrom(from)

    if (to !== undefined) {
      this.model.updateTo(to)
    }
  }

  setFrom(from: number): void {
    this.model.updateFrom(from)
  }

  setTo(to: number): void {
    this.model.updateTo(to)
  }

  getFrom(): string {
    return this.model.getFrom()
  }

  getTo(): string {
    return this.model.getTo()
  }

  setMin(min: number): void {
    this.model.setMinValue(min)
  }

  setMax(max: number): void {
    this.model.setMaxValue(max)
  }

  setStep(step: number): void {
    this.model.setStep(step)
  }

  getInstance(): HTMLElement {
    return this.view.getElement()
  }

  showLabels(): void {
    this.view.toggleLabels(true)
  }

  hideLabels(): void {
    this.view.toggleLabels(false)
  }

  showRuler(): void {
    this.view.toggleRuler(true)
  }

  hideRuler(): void {
    this.view.toggleRuler(false)
  }

  onUpdate(handler: (value: string) => void): void {
    this.model.addUpdateHandler(handler)
  }

  private getOrientationOption(orientation: Orientation): OrientationOption {
    const orientationOptions: OrientationOptions = {
      horizontal: {
        orientation: 'horizontal',
        longSide: 'width',
        shortSide: 'height',
        x: 'x',
        y: 'y',
      },
      vertical: {
        orientation: 'vertical',
        longSide: 'height',
        shortSide: 'width',
        x: 'y',
        y: 'x',
      },
    }

    return orientationOptions[orientation]
  }
}

export default Tslider
