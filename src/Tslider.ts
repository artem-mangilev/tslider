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
  private inputValuesSeparator: string
  private model: Model

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
    label = true,
    hideInput = true,
    inputValuesSeparator = ',',
  }: SliderOptions) {
    this.rulerFlag = ruler
    this.rulerActiveFlag = rulerActive
    this.inputValuesSeparator = inputValuesSeparator

    // 'from' is required parameter at this moment, to is optional
    const rangeValues: number[] = [from, ...(to !== undefined ? [to] : [])]

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
    const numberOfHandles = rangeValues.length
    // create view options
    const viewOptions: ViewOptions = {
      orientationOption,
      numberOfHandles,
      targetInput,
      label,
      hideInput,
      inputValuesSeparator,
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
      values: rangeValues,
    }

    // initialize the Model and attach this class to Model as observer of changes
    // TODO: in this class the model is presented as class field and an argument of handleInitializationAction
    this.model = new Model(modelOptions, this)
  }

  // TODO: this method should not be public
  // TODO: ths name should be used for API method which updates the handles
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
    const updatePoint = model.updatePoint.bind(model)
    // when user clicks to some area of the track, move the handle at this position
    this.view.onTrackClick(updatePoint)
    // when the user dragged the handle, move it to apropriate position
    this.view.onHandleDrag(updatePoint)

    const updateLine = model.updateLine.bind(model)
    this.view.onTrackLengthChanged(updateLine)

    const updateValues = model.updateHandlesByValues.bind(model)
    this.view.onInputUpdate(updateValues)

    if (this.rulerFlag) {
      this.view.renderRuler(model.ruler)
    }

    if (this.rulerActiveFlag) {
      this.view.onRulerClick(updateValues)
    }
  }

  private handleSlideAction({
    handlePositions,
    rangeStartPosition,
    rangeEndPosition,
    values,
    ruler,
  }: any): void {
    this.view.slideTo(handlePositions)

    // TODO: find the way to hide this functionality back to slideTo
    this.view.updateRange([rangeStartPosition, rangeEndPosition])

    this.view.updateLabels(handlePositions, values)

    if (this.rulerFlag) {
      this.view.updateRuler(ruler)
    }

    this.view.updateInput(values.join(this.inputValuesSeparator))
  }

  public updateHandles(from: number, to?: number): void {
    if (to === undefined) {
      this.model.updateHandlesByValues([from])
    } else {
      this.model.updateHandlesByValues([from, to])
    }
  }
}

export default Tslider
