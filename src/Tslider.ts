import Model from './model/Model'
import { ModelEvents } from './model/ModelEvents'
import ModelEventsHandler from './ModelEventsHandler'
import SliderParams from './SliderParams'
import { Orientation } from './utils/aliases'
import { OrientationOption, OrientationOptions } from './utils/OrientationOptions'
import View from './view/View'

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
    this.view = new View({
      orientationOption: this.getOrientationOption(orientation),
      targetInput,
      showLabels,
      showRuler,
      isRulerClickable,
      hideInput,
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
    if (to === undefined) {
      this.model.updateHandlesByValues([from])
    } else {
      this.model.updateHandlesByValues([from, to])
    }
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
