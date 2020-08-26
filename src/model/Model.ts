import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Point from '../utils/Point'
import Subject from '../utils/Subject'
import Handle from './Handle'
import ModelOptions from './ModelOptions'
import { ModelUpdateTypes } from './ModelUpdateTypes'
import Track from './Track'
import RulerSegment from '../RulerSegment'
import Observer from '../utils/Observer'
import ValuesToTrackLengthConverter from './ValuesRangeTrackConverter'

class Model extends Subject {
  private track: Track
  private handles: Handle[] = []
  private converter: ValuesToTrackLengthConverter

  constructor(private options: ModelOptions, observer?: Observer) {
    super()

    this.converter = new ValuesToTrackLengthConverter(
      options.min,
      options.max,
      options.step
    )

    options.values.forEach((data) => {
      const coordinate = this.converter.toTrackPoint(data, options.trackLength)
      this.handles.push(new Handle(coordinate))
    })

    this.track = new Track(
      this.converter.getNumberOfSteps(),
      options.trackLength,
      this.handles
    )

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

    const availablePoint = this.track.validatePoint(targetPoint)

    // this is just an optimisation to avoid dummy renders
    // (when nothing actually changes in the screen) in view
    if (availablePoint !== activeHandle.position) {
      activeHandle.position = availablePoint

      this.notify(ModelUpdateTypes.Slide, this.getState)
    }
  }

  public updateValues(values: number[]): void {
    // TODO: remove duplicated code
    switch (values.length) {
      case 1:
        const [from] = values

        const point = this.converter.toTrackPoint(from, this.track.length)

        const activeHandleIndex = this.track.getNearestPointIndex(point)
        const activeHandle = this.handles[activeHandleIndex]
        this.track.setActiveHandle(activeHandle)

        const availablePoint = this.track.validatePoint(point)

        activeHandle.position = availablePoint

        break
      case 2:
        values.forEach((value, i) => {
          const point = this.converter.toTrackPoint(value, this.track.length)

          const availablePoint = this.track.validatePoint(point)

          this.handles[i].position = availablePoint
        })

        break
    }

    this.notify(ModelUpdateTypes.Slide, this.getState)
  }

  // TODO: bad method name, model shouldn't know about slider resizing
  public updateLine(lineLength: number): void {
    this.values.forEach((value, i) => {
      const coordinate = this.converter.toTrackPoint(value, lineLength)

      this.handles[i].position = coordinate
    })

    this.track.length = lineLength

    // TODO: current method needs another update type
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

  private get values(): number[] {
    return this.handlePositions.map((position) =>
      Math.round(this.converter.toValue(position, this.track.length))
    )
  }

  public get ruler(): RulerSegment[] {
    const trackStep: number = this.track.length / this.options.rulerSteps

    const _ruler = []

    let currentTrackStep: number = 0

    for (let i = 0; i <= this.options.rulerSteps; i++) {
      const value = this.converter.toValue(currentTrackStep, this.track.length)

      _ruler.push({
        point: currentTrackStep,
        value,
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
          values: this.values,
          rangeStartPosition: this.rangeStartPosition,
          rangeEndPosition: this.rangeEndPosition,
          ruler: this.ruler,
        }
    }
  }
}

export default Model
