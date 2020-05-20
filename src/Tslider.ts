import View from './View'
import Model from './Model'
import { SliderOptions } from './SliderOptions'
import { RatioPoint } from './RatioPoint'
import { ModelOptions } from './ModelOptions'

class Tslider implements Observer {
  private view: View

  constructor(options: SliderOptions) {
    // initialize the View
    this.view = new View()

    // the Model needs an additional data
    const modelOptions: ModelOptions = {
      ...options,
      trackWidth: this.view.trackWidth,
    }

    // initialize the Model
    const model: Model = new Model(modelOptions)

    // register this class as observer of the model
    model.attach(this)

    // compute the initial point
    const initialPointX = model.convertDataToPointX(options.current)
    // set initial handle position
    model.moveHandle(initialPointX)

    // when user clicks to some area of the track, move the handle at this position
    this.view.trackClick((trackClickX) => {
      model.moveHandle(trackClickX)
    })

    // when the user dragged the handle, move it to apropriate position
    this.view.handleDrag((trackMouseX) => {
      model.moveHandle(trackMouseX)
    })
  }

  // TODO: hide implementation details of the Model. This class shouldn't know that model has a handlePositionX and handlePositionY properties
  public update(model: Model): void {
    const handlePosition: RatioPoint = {
      x: model.handlePositionX,
      y: model.handlePositionY,
    }

    const data = model.dataAmount.toString()

    this.view.slideTo(handlePosition, data)

    this.view.updateRange(handlePosition.x)
  }
}

export default Tslider
