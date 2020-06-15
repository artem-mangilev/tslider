import Model from './model/Model'
import ModelOptions from './model/ModelOptions'
import { ModelUpdateTypes } from './model/ModelUpdateTypes'
import SliderOptions from './SliderOptions'
import Observer from './utils/Observer'
import View from './view/View'
import ViewOptions from './view/ViewOptions'

class Tslider implements Observer {
  private view: View

  constructor({
    targetInput,
    labelMarginFromTrack,
    from,
    to,
    max,
    min,
    step,
  }: SliderOptions) {
    // 'from' is required parameter at this moment
    const handlesData: number[] = [from]

    // 'to' is optional
    if (to !== undefined) {
      handlesData.push(to)
    }

    // create view options
    const viewOptions: ViewOptions = {
      targetInput,
      labelMarginFromTrack,
      numberOfHandles: handlesData.length,
    }

    // initialize the View
    this.view = new View(viewOptions)

    // the Model needs an additional data
    const modelOptions: ModelOptions = {
      max,
      min,
      step,
      trackLength: this.view.containerWidth,
    }

    // initialize the Model and attach this class to Model as observer of changes
    const model: Model = new Model(modelOptions)
    model.attach(this)

    model.initSlider(handlesData)
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
    // when user clicks to some area of the track, move the handle at this position
    this.view.onTrackClick((point) => {
      model.moveHandle(point)
    })

    // when the user dragged the handle, move it to apropriate position
    this.view.onHandleDrag((point, index) => {
      model.moveHandle(point, index)
    })
  }

  // TODO: hide implementation details of the Model
  private handleSlideAction(model: Model): void {
    this.view.slideTo(model.handlePositions)

    // TODO: find the way to hide this functionality back to slideTo
    // TODO: range didn't rendered in vertical orientation
    this.view.updateRange(model.rangeLength, model.rangeStartPosition)

    this.view.updateLabels(model.handlePositions, model.dataAmount)
  }
}

export default Tslider
