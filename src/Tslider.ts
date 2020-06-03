import View from './View'
import Model from './Model'
import SliderOptions from './SliderOptions'
import ModelOptions from './ModelOptions'
import Observer from './utils/Observer'
import ViewOptions from './ViewOptions'
import Point from './utils/Point'

class Tslider implements Observer {
  private view: View

  constructor(private options: SliderOptions) {
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
      trackWidth:
        options.orientation === 'horizontal'
          ? this.view.containerWidth
          : this.view.containerHeight,
      trackHeight: this.view.trackHeight,
      labelWidth: this.view.labelWidth,
      labelHeight: this.view.labelHeight,
    }

    // initialize the Model
    const model: Model = new Model(modelOptions)

    // register this class as observer of the model
    model.attach(this)

    model.initSlider(options.current)

    // set correct orientation of the track
    this.view.drawTrack(model.trackWidth, model.trackHeight)

    // when user clicks to some area of the track, move the handle at this position
    this.view.onTrackClick((point) => {
      model.moveHandle(this.validatePoint(point))
    })

    // when the user dragged the handle, move it to apropriate position
    this.view.handleDrag((point) => {
      model.moveHandle(this.validatePoint(point))
    })
  }

  // TODO: hide implementation details of the Model. This class shouldn't know that model has a handlePositionX and handlePositionY properties
  public update(model: Model): void {
    const data = model.dataAmount.toString()
    this.view.slideTo(this.validatePoint(model.handlePosition), data)

    // TODO: find the way to hide this functionality back to slideTo
    this.view.updateRange(
      model.rangeWidth,
      model.rangeHeight,
      this.validatePoint(model.rangeStartPosition)
    )

    this.view.updateLabel(
      this.validatePoint(model.labelPosition),
      model.dataAmount
    )
  }

  private validatePoint(point: Point): Point {
    if (this.options.orientation === 'vetical') {
      return { x: point.y, y: point.x }
    }

    return point
  }
}

export default Tslider
