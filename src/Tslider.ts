import Model from './model/Model'
import ModelOptions from './model/ModelOptions'
import { ModelUpdateTypes } from './model/ModelUpdateTypes'
import SliderOptions from './SliderOptions'
import Observer from './utils/Observer'
import View from './view/View'
import ViewOptions from './view/ViewOptions'
import { OrientationOptions } from './OrientationOptions'

class Tslider implements Observer {
  private view: View
  private rulerFlag: boolean
  private rulerActiveFlag: boolean

  constructor({
    targetInput,
    from,
    to,
    max,
    min,
    step,
    orientation,
    ruler = false,
    rulerSteps = 4,
    rulerActive = true,
  }: SliderOptions) {
    this.rulerFlag = ruler
    this.rulerActiveFlag = rulerActive

    // 'from' is required parameter at this moment, to is optional
    const handlesData: number[] = [from, ...(to !== undefined ? [to] : [])]

    const orientationOptions: OrientationOptions = {
      horizontal: {
        orientation: 'horizontal',
        longSide: 'width',
        shortSide: 'height',
        x: 'x',
        y: 'y',
        direction: 'left-to-right',
      },
      vertical: {
        orientation: 'vertical',
        longSide: 'height',
        shortSide: 'width',
        x: 'y',
        y: 'x',
        direction: 'bottom-to-top',
      },
    }

    const orientationOption = orientationOptions[orientation]
    const numberOfHandles = handlesData.length
    // create view options
    const viewOptions: ViewOptions = {
      orientationOption,
      numberOfHandles,
      targetInput,
    }

    // initialize the View
    this.view = new View(viewOptions)

    const trackLength = this.view.trackLength

    // if the step isn't provided, the step is 1/100 of track length
    if (step === undefined) {
      step = trackLength / 100
    }

    // the Model needs an additional data
    const modelOptions: ModelOptions = {
      max,
      min,
      step,
      trackLength,
      rulerSteps,
    }

    // initialize the Model and attach this class to Model as observer of changes
    const model: Model = new Model(modelOptions)
    model.attach(this)

    model.initSlider(handlesData)
  }

  public update(updateType: ModelUpdateTypes, state: Model): void {
    switch (updateType) {
      case ModelUpdateTypes.Initialization:
        this.handleInitializationAction(state)
        break
      case ModelUpdateTypes.Slide:
        this.handleSlideAction(state)
        break
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

    if (this.rulerFlag) {
      this.view.renderRuler(model.ruler)
    }

    if (this.rulerActiveFlag) {
      const moveByValue = model.moveByValue.bind(model)
      this.view.onRulerClick(moveByValue)
    }
  }

  private handleSlideAction({
    handlePositions,
    rangeStartPosition,
    rangeEndPosition,
    dataAmount,
  }: any): void {
    this.view.slideTo(handlePositions)

    // TODO: find the way to hide this functionality back to slideTo
    this.view.updateRange([rangeStartPosition, rangeEndPosition])

    this.view.updateLabels(handlePositions, dataAmount)
  }
}

export default Tslider
