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
      this.view.handleWidth
    )

    // register this class as observer of the model
    model.attach(this)

    // when user clicks to some area of the track, move the handle at this position
    this.view.trackClick((trackClickX) => {
      model.handlePositionRatioX(trackClickX)
    })
  }

  // TODO: hide implementation details of the Model. This class shouldn't know that model has a currentHandlePositionX property
  public update(model: Model): void {
    const currentHandlePositionX = model.currentHandlePositionX

    this.view.moveHandleX(currentHandlePositionX)

    const dataAmount = (currentHandlePositionX * this.options.max).toString()

    this.view.updateHandleData(dataAmount)
  }
}

export default Tslider
