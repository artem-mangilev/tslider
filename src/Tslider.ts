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

  // TODO: hide implementation details of the Model, for each action give the apropriate data, not the whole object
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
    // the arguments of view events maps to arguments of moveHandle, so
    // we could just set move handle as a callback for view events
    const move = model.moveHandle.bind(model)
    // when user clicks to some area of the track, move the handle at this position
    this.view.onTrackClick(move)
    // when the user dragged the handle, move it to apropriate position
    this.view.onHandleDrag(move)
  }

  private handleSlideAction({
    handlePositions,
    rangeLength,
    rangeStartPosition,
    dataAmount,
  }: Model): void {
    this.view.slideTo(handlePositions)

    // TODO: find the way to hide this functionality back to slideTo
    this.view.updateRange(rangeLength, rangeStartPosition)

    this.view.updateLabels(handlePositions, dataAmount)
  }
}

export default Tslider
