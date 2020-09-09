import Model from './model/Model'
import ModelOptions from './model/ModelOptions'
import { ModelEvents } from './model/ModelEvents'
import SliderOptions from './SliderOptions'
import Observer from './utils/Observer'
import View from './view/View'
import ViewOptions from './view/ViewOptions'
import { OrientationOptions } from './OrientationOptions'

class Tslider implements Observer {
  private view: View
  private rulerFlag: boolean
  private rulerActiveFlag: boolean
  private model: Model
  private labelFlag: boolean

  constructor({
    targetInput,
    from,
    to,
    max,
    min,
    step,
    orientation,
    ruler = false,
    rulerSteps = 4,
    rulerActive = true,
    label = true,
    hideInput = true,
    inputValuesSeparator = ',',
  }: SliderOptions) {
    this.labelFlag = label
    this.rulerFlag = ruler
    this.rulerActiveFlag = rulerActive

    const rangeValues: number[] = [from, ...(to !== undefined ? [to] : [])]

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

    const orientationOption = orientationOptions[orientation]
    const numberOfHandles = rangeValues.length
    const viewOptions: ViewOptions = {
      orientationOption,
      numberOfHandles,
      targetInput,
      label,
      hideInput,
      inputValuesSeparator,
    }

    this.view = new View(viewOptions)

    const modelOptions: ModelOptions = {
      max,
      min,
      step,
      rulerSteps,
      values: rangeValues,
      trackWidth: this.view.getTrackWidth(),
      trackHeight: this.view.getTrackHeight(),
      inputValuesSeparator,
    }

    this.model = new Model(modelOptions)
    this.model.attach(this)
    this.model.notify(ModelEvents.Init)
  }

  // TODO: this method should not be public
  public update(event: ModelEvents, state: Model): void {
    if (event === ModelEvents.Init) {
      this.handleInit(state)
    }

    if (event === ModelEvents.Update) {
      this.handleUpdate(state)
    }
  }

  private handleInit(model: Model): void {
    this.view.onTrackClick(model.updateHandle.bind(model))
    this.view.onHandleDrag(model.updateHandleByIndex.bind(model))
    this.view.onTrackLengthChanged(model.resize.bind(model))
    this.view.onInputUpdate(model.updateHandlesByInput.bind(model))

    if (this.rulerActiveFlag) {
      this.view.onRulerClick(model.updateHandleByValue.bind(model))
    }
  }

  private handleUpdate({
    handles,
    rangePosition,
    rangeLength,
    ruler,
    inputValue,
  }: Model): void {
    this.view.renderHandles(handles.map((handle) => handle.position))

    this.view.renderRange(rangePosition, rangeLength)

    if (this.labelFlag) {
      this.view.renderLabels(
        handles.map((handle) => ({
          position: handle.position.x,
          value: handle.value,
        }))
      )
    }

    if (this.rulerFlag) {
      this.view.renderRuler(ruler)
    }

    this.view.renderInput(inputValue)
  }

  public updateHandles(from: number, to?: number): void {
    if (to === undefined) {
      this.model.updateHandlesByValues([from])
    } else {
      this.model.updateHandlesByValues([from, to])
    }
  }
}

export default Tslider
