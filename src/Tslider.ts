import Model from './model/Model'
import ModelOptions from './model/ModelParams'
import { ModelEvents } from './model/ModelEvents'
import SliderParams from './SliderParams'
import View from './view/View'
import ViewParams from './view/ViewParams'
import { OrientationOptions } from './utils/OrientationOptions'
import ModelEventsHandler from './ModelEventsHandler'

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
    hideInput = true,
    inputValuesSeparator = ',',
  }: SliderParams) {
    const rangeValues = [from, ...(to !== undefined ? [to] : [])]

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
    const viewOptions: ViewParams = {
      orientationOption,
      targetInput,
      showLabels,
      showRuler,
      isRulerClickable,
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
    this.handler = new ModelEventsHandler(this.view)
    this.model.attach(this.handler)
    this.model.notify(ModelEvents.Init)
  }

  updateHandles(from: number, to?: number): void {
    if (to === undefined) {
      this.model.updateHandlesByValues([from])
    } else {
      this.model.updateHandlesByValues([from, to])
    }
  }
}

export default Tslider
