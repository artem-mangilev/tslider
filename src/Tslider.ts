import View from './View'
import Model from './Model'
import { SliderOptions } from './SliderOptions'

class Tslider implements Observer {
  private view: View
  private options: SliderOptions

  constructor(options: SliderOptions) {
    // initialize an options
    this.options = options

    // initialize the View
    this.view = new View()

    // initialize the Model
    // TODO: decrease the number of arguments. Possible solution: create additional extended interface with needed properties for Model
    const model: Model = new Model(
      options,
      this.view.trackWidth,
      this.view.trackHeight
    )

    // register this class as observer of the model
    model.attach(this)

    // set initial handle position
    model.moveHandle(0)

    // when user clicks to some area of the track, move the handle at this position
    this.view.trackClick((trackClickX) => {
      model.moveHandle(trackClickX)
    })
  }

  // TODO: hide implementation details of the Model. This class shouldn't know that model has a currentHandlePositionRatioX property
  public update(model: Model): void {
    const currentHandlePositionRatioX = model.handlePositionRatioX
    const currentHandlePositionRatioY = model.handlePositionRatioY
    this.view.moveHandle(
      currentHandlePositionRatioX,
      currentHandlePositionRatioY
    )

    this.view.updateRange(currentHandlePositionRatioX)

    this.view.updateHandleData(model.dataAmount.toString())
  }
}

export default Tslider
