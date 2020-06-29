import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Point from '../utils/Point'
import Subject from '../utils/Subject'
import Data from './Data'
import Handle from './Handle'
import ModelOptions from './ModelOptions'
import { ModelUpdateTypes } from './ModelUpdateTypes'
import Track from './Track'
import RulerSegment from '../RulerSegment'
import Observer from '../utils/Observer'

class Model extends Subject {
  private track: Track
  private data: Data
  private handles: Handle[] = []

  constructor(private options: ModelOptions, observer?: Observer) {
    super()

    // initialize the data
    this.data = new Data(options.min, options.max, options.step)

    // initialize track class
    this.track = new Track(this.data.numberOfSteps, options.trackLength)

    options.values.forEach((data) => {
      const dataRatio = this.data.getAmountAsRatio(data)

      const coordinate: OneDimensionalSpacePoint = dataRatio * this.track.length
      this.handles.push(new Handle(coordinate))
    })

    this.track.registerHandles(this.handles)

    // Optionally observer could be attached with class constructor 
    if (observer) {
      this.attach(observer)

      this.notify(ModelUpdateTypes.Initialization, this.getState)
      // make the initial draw of the slider
      // TODO: by this call, model could assume that the view couldn't draw the slider in initialization step,
      // so find the better way to make iniital draw
      this.notify(ModelUpdateTypes.Slide, this.getState)
    }
  }

  public updatePoint(
    targetPoint: OneDimensionalSpacePoint,
    handleIndex?: number
  ): void {
    // these condition help the Model to decide should it compute which handle should be used,
    // or use a provided handleIndex
    let activeHandleIndex =
      handleIndex === undefined
        ? this.track.getNearestPointIndex(targetPoint)
        : handleIndex

    const activeHandle = this.handles[activeHandleIndex]

    this.track.setActiveHandle(activeHandle)

    const availablePoint = this.track.getAvailablePoint(targetPoint)

    // this is just an optimisation to avoid dummy renders
    // (when nothing actually changes in the screen) in view
    if (availablePoint !== activeHandle.position) {
      activeHandle.position = availablePoint

      this.notify(ModelUpdateTypes.Slide, this.getState)
    }
  }

  // TODO: 2 methods below have simular functionality
  public updateValue(value: number): void {
    const valueRatio = this.data.getAmountAsRatio(value)
    const trackPoint = this.track.ratioToPoint(valueRatio)

    const activeHandleIndex = this.track.getNearestPointIndex(trackPoint)

    const activeHandle = this.handles[activeHandleIndex]

    this.track.setActiveHandle(activeHandle)

    const availablePoint = this.track.getAvailablePoint(trackPoint)

    activeHandle.position = availablePoint

    this.notify(ModelUpdateTypes.Slide, this.getState)
  }

  public updateValues(values: number[]): void {
    values.forEach((value, i) => {
      const valueRatio = this.data.getAmountAsRatio(value)
      const trackPoint = this.track.ratioToPoint(valueRatio)

      const availablePoint = this.track.getAvailablePoint(trackPoint)

      this.handles[i].position = availablePoint
    })

    this.notify(ModelUpdateTypes.Slide, this.getState)
  }

  // TODO: bad method name, model shouldn't know about slider resizing
  public updateLine(lineLength: number): void {
    this.dataAmount.forEach((value, i) => {
      const dataRatio = this.data.getAmountAsRatio(value)

      const coordinate: OneDimensionalSpacePoint = dataRatio * lineLength

      this.handles[i].position = coordinate
    })

    this.track.length = lineLength

    this.notify(ModelUpdateTypes.Slide, this.getState)
  }

  private get rangeStartPosition(): OneDimensionalSpacePoint {
    return this.track.rangeStartPosition
  }

  private get rangeEndPosition(): OneDimensionalSpacePoint {
    return this.track.rangeEndPosition
  }

  private get handlePositions(): OneDimensionalSpacePoint[] {
    return this.handles.map((handle) => handle.position)
  }

  private get dataAmount(): number[] {
    const handlePositionRatios: Ratio[] = this.handlePositions.map((position) =>
      this.track.pointToRatio(position)
    )

    return handlePositionRatios.map((ratio) => this.data.getAmount(ratio))
  }

  public get ruler(): RulerSegment[] {
    const trackStep: number = this.track.length / this.options.rulerSteps

    const _ruler = []

    let currentTrackStep: number = 0

    for (let i = 0; i <= this.options.rulerSteps; i++) {
      const currentTrackStepRatio = this.track.pointToRatio(currentTrackStep)
      const currentData = this.data.getAmount(currentTrackStepRatio)

      _ruler.push({
        point: currentTrackStep,
        value: currentData,
      })

      currentTrackStep += trackStep
    }

    return _ruler
  }

  // TODO: state should be covered with types
  // TODO: Subject should require the presence of this method in Model
  private getState = (updateType: number): any => {
    switch (updateType) {
      case ModelUpdateTypes.Initialization:
        return this
      case ModelUpdateTypes.Slide:
        return {
          handlePositions: this.handlePositions,
          dataAmount: this.dataAmount,
          rangeStartPosition: this.rangeStartPosition,
          rangeEndPosition: this.rangeEndPosition,
          ruler: this.ruler,
        }
    }
  }
}

export default Model
