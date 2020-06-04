import Model from './model/Model'
import ModelOptions from './model/ModelOptions'
import { ModelUpdateTypes } from './model/ModelUpdateTypes'
import SliderOptions from './SliderOptions'
import Observer from './utils/Observer'
import Point from './utils/Point'
import View from './view/View'
import ViewOptions from './view/ViewOptions'

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

    // initialize the Model and attach this class to Model as observer of changes
    const model: Model = new Model(modelOptions)
    model.attach(this)

    model.initSlider(options.from, options.to)
  }

  public update(updateType: ModelUpdateTypes, model: Model): void {
    // this works a little big magical: when ModelUpdateTypes.Initialization occurs,
    // handleSlideAction is also evaluated for drawing the initial state of the model
    // (this is the reason to omit break statement)
    // in the following cases only handleSlideAction is evaluated
    switch (updateType) {
      case ModelUpdateTypes.Initialization:
        this.handleInitializationAction(model)

      case ModelUpdateTypes.Slide:
        this.handleSlideAction(model)
    }
  }

  private handleInitializationAction(model: Model): void {
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

  // TODO: hide implementation details of the Model
  private handleSlideAction(model: Model): void {
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
