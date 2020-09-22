import Model from './model/Model'
import { ModelEvents } from './model/ModelEvents'
import ModelEventsHandler from './ModelEventsHandler'
import View from './view/View'
import './plugin.scss'
import ModelDependencyBuilder from './model/ModelDependencyBuilder'

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
      orientation,
      targetInput,
      showLabels,
      showRuler,
      isRulerClickable,
      inputValuesSeparator,
    })

    const values = [from, ...(to !== undefined ? [to] : [])]
    const modelParams = {
      max,
      min,
      step,
      rulerSteps,
      values,
      trackWidth: this.view.getTrackWidth(),
      trackHeight: this.view.getTrackHeight(),
      inputValuesSeparator,
    }

    const modelDeps = new ModelDependencyBuilder(modelParams)
    this.model = new Model(modelDeps.build())

    this.handler = new ModelEventsHandler(this.view)
    this.model.attach(this.handler)

    this.model.notify(ModelEvents.Init)
  }

  setFrom(from: number): void {
    this.model.setFrom(from)
  }

  setTo(to: number): void {
    this.model.setTo(to)
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

  getMin(): number {
    return this.model.getMinValue()
  }

  getMax(): number {
    return this.model.getMaxValue()
  }

  setStep(step: number): void {
    this.model.setStep(step)
  }

  getStep(): number {
    return this.model.getStep()
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
}

export default Tslider
