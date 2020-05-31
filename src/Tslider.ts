import View from './View'
import Model from './Model'
import SliderOptions from './SliderOptions'
import ModelOptions from './ModelOptions'
import Observer from './utils/Observer'
import ViewOptions from './ViewOptions'
import Point from './utils/Point'

class Tslider implements Observer {
  private view: View

  constructor(options: SliderOptions) {
    // create view options
    const viewOptions: ViewOptions = {
      targetInput: options.targetInput,
      orientation: options.orientation,
      labelMarginFromTrack: options.labelMarginFromTrack,
    }

    // initialize the View
    this.view = new View(viewOptions)

    // TODO: remove input node from modelOptions
    // the Model needs an additional data
    const modelOptions: ModelOptions = {
      ...options,
      trackWidth: this.view.trackWidth,
      trackHeight: this.view.trackHeight,
      labelWidth: this.view.labelWidth,
      labelHeight: this.view.labelHeight,
    }

    // initialize the Model
    const model: Model = new Model(modelOptions)

    // TODO: maybe the model should provide width and height?
    // set correct orientation of the track
    this.view.drawTrack(this.view.trackWidth, this.view.trackHeight)

    // register this class as observer of the model
    model.attach(this)

    // compute the initial point
    const initialPoint = model.initHandleWithData(options.current)
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

    // TODO: find the way to hide this functionality back to slideTo
    this.view.updateRange(
      model.rangeWidth,
      model.rangeHeight,
      model.rangeStartPosition
    )

    this.view.updateLabel(model.labelPosition, model.dataAmount)
  }
}

export default Tslider
