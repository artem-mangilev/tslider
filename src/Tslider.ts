import View from './View'
import Model from './Model'
import SliderOptions from './SliderOptions'
import ModelOptions from './ModelOptions'
import Observer from './utils/Observer'
import ViewOptions from './ViewOptions'

class Tslider implements Observer {
  private view: View

  constructor(options: SliderOptions) {
    // create view options
    const viewOptions: ViewOptions = {
      targetInput: options.targetInput,
    }

    // initialize the View
    this.view = new View(viewOptions)

    // TODO: remove input node from modelOptions
    // the Model needs an additional data
    const modelOptions: ModelOptions = {
      ...options,
      trackWidth: this.view.trackWidth,
      trackHeight: this.view.trackHeight,
    }

    // initialize the Model
    const model: Model = new Model(modelOptions)

    // set correct orientation of the track
    this.view.trackWidth = model.trackWidth
    this.view.trackHeight = model.trackHeight

    // register this class as observer of the model
    model.attach(this)

    // compute the initial point
    const initialPoint = model.convertDataToPoint(options.current)
    // set initial handle position
    model.moveHandle(initialPoint)

    // when user clicks to some area of the track, move the handle at this position
    this.view.onTrackClick((point) => {
      model.moveHandle(point)
    })

    // when the user dragged the handle, move it to apropriate position
    this.view.handleDrag((point) => {
      model.moveHandle(point)
    })
  }

  // TODO: hide implementation details of the Model. This class shouldn't know that model has a handlePositionX and handlePositionY properties
  public update(model: Model): void {
    const data = model.dataAmount.toString()
    this.view.slideTo(model.handlePosition, data)
  }
}

export default Tslider
