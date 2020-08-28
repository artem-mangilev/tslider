import Subject from '../utils/Subject'
import Handle from './Handle'
import ModelOptions from './ModelOptions'
import { ModelUpdateTypes } from './ModelUpdateTypes'
import Track from './Track'
import RulerSegment from '../RulerSegment'
import Observer from '../utils/Observer'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'
import Ruler from './Ruler'

class Model extends Subject {
  private track: Track
  private handles: Handle[] = []
  private converter: ValuesToTrackPointConverter
  private _ruler: Ruler

  constructor(private options: ModelOptions, observer?: Observer) {
    super()

    this.converter = new ValuesToTrackPointConverter(
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

    this._ruler = new Ruler(this.track, this.converter)

    if (observer) {
      this.attach(observer)

      this.notify(ModelUpdateTypes.Initialization)
      // make the initial draw of the slider
      // TODO: by this call, model could assume that the view couldn't draw the slider in initialization step,
      // so find the better way to make iniital draw
      this.notify(ModelUpdateTypes.Slide)
    }
  }

  updateHandle(point: number): void {
    const handle = this.handles[this.track.getNearestPointIndex(point)]
    this.track.setActiveHandle(handle)
    const availablePoint = this.track.validatePoint(point)

    if (availablePoint !== handle.position) {
      handle.position = availablePoint

      this.notify(ModelUpdateTypes.Slide)
    }
  }

  updateHandleByIndex(point: number, index: number): void {
    if (!this.handles[index]) return

    const handle = this.handles[index]
    this.track.setActiveHandle(handle)
    const availablePoint = this.track.validatePoint(point)

    if (availablePoint !== handle.position) {
      handle.position = availablePoint

      this.notify(ModelUpdateTypes.Slide)
    }
  }

  public updateHandlesByValues(values: number[]): void {
    this.handles.forEach((handle, i) => {
      if (values[i] !== undefined) {
        const point = this.converter.toTrackPoint(values[i], this.track.length)
        handle.position = this.track.validatePoint(point)
      }
    })

    this.notify(ModelUpdateTypes.Slide)
  }

  // TODO: bad method name, model shouldn't know about slider resizing
  public updateLine(lineLength: number): void {
    this.values.forEach((value, i) => {
      const coordinate = this.converter.toTrackPoint(value, lineLength)

      this.handles[i].position = coordinate
    })

    this.track.length = lineLength

    // TODO: current method needs another update type
    this.notify(ModelUpdateTypes.Slide)
  }

  get rangeStartPosition(): number {
    return this.track.rangeStartPosition
  }

  get rangeEndPosition(): number {
    return this.track.rangeEndPosition
  }

  get handlePositions(): number[] {
    return this.handles.map((handle) => handle.position)
  }

  get values(): number[] {
    return this.handlePositions.map((position) =>
      Math.round(this.converter.toValue(position, this.track.length))
    )
  }

  get ruler(): RulerSegment[] {
    return this._ruler.getSegments(this.options.rulerSteps)
  }
}

export default Model
