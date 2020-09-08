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
  private model: Model
  private labelFlag: boolean

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
    this.labelFlag = label
    this.rulerFlag = ruler
    this.rulerActiveFlag = rulerActive

    // 'from' is required parameter at this moment, to is optional
    const rangeValues: number[] = [from, ...(to !== undefined ? [to] : [])]

    const orientationOptions: OrientationOptions = {
      horizontal: {
        orientation: 'horizontal',
        longSide: 'width',
        shortSide: 'height',
        x: 'x',
        y: 'y',
      },
      vertical: {
        orientation: 'vertical',
        longSide: 'height',
        shortSide: 'width',
        x: 'y',
        y: 'x',
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

    // if the step isn't provided, the step is 1/100 of track length
    if (step === undefined) {
      step = this.view.getTrackWidth() / 100
    }

    // the Model needs an additional data
    const modelOptions: ModelOptions = {
      max,
      min,
      step,
      rulerSteps,
      values: rangeValues,
      trackWidth: this.view.getTrackWidth(),
      trackHeight: this.view.getTrackHeight(),
      inputValuesSeparator,
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
    const updateHandle = model.updateHandle.bind(model)
    // when user clicks to some area of the track, move the handle at this position
    this.view.onTrackClick(updateHandle)
    const updateHandlesByIndex = model.updateHandleByIndex.bind(model)
    // when the user dragged the handle, move it to apropriate position
    this.view.onHandleDrag(updateHandlesByIndex)

    const resize = model.resize.bind(model)
    this.view.onTrackLengthChanged(resize)

    const updateHandlesByInput = model.updateHandlesByInput.bind(model)
    this.view.onInputUpdate(updateHandlesByInput)

    if (this.rulerFlag) {
      this.view.renderRuler(model.ruler)
    }

    if (this.rulerActiveFlag) {
      this.view.onRulerClick(updateHandle)
    }
  }

  private handleSlideAction({
    handles,
    rangePosition,
    rangeLength,
    ruler,
    inputValue,
  }: Model): void {
    this.view.slideTo(handles.map((handle) => handle.position))

    // TODO: find the way to hide this functionality back to slideTo
    // this.view.updateRange(rangeStartPosition, rangeEndPosition)
    this.view.updateRange(rangePosition, rangeLength)

    if (this.labelFlag) {
      this.view.updateLabels(
        handles.map((handle) => ({
          position: handle.position.x,
          value: handle.value,
        }))
      )
    }

    // if (this.rulerFlag) {
    //   this.view.renderRuler(ruler)
    // }

    this.view.updateInput(inputValue)
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
