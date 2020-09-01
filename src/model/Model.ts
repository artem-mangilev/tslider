import Subject from '../utils/Subject'
import ModelOptions from './ModelOptions'
import { ModelUpdateTypes } from './ModelUpdateTypes'
import Track from './Track'
import RulerSegment from '../RulerSegment'
import Observer from '../utils/Observer'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'
import Ruler from './Ruler'
import Shape from '../utils/Shape'
import HandleX from './HandleX'
import HandleY from './HandleY'
import Point from '../utils/Point'

class Model extends Subject {
  private track: Track
  private handlesX: HandleX[] = []
  private converter: ValuesToTrackPointConverter
  private _ruler: Ruler
  private trackShape: Shape
  private handleY: HandleY

  constructor(private options: ModelOptions, observer?: Observer) {
    super()

    this.converter = new ValuesToTrackPointConverter(
      options.min,
      options.max,
      options.step
    )

    this.trackShape = {
      width: options.trackWidth,
      height: options.trackHeight,
    }

    this.handleY = new HandleY(this.trackShape.height)

    options.values.forEach((data) => {
      const coordinate = this.converter.toTrackPoint(data, options.trackLength)
      this.handlesX.push(new HandleX(coordinate))
    })

    this.track = new Track(
      this.converter.getNumberOfSteps(),
      options.trackLength,
      this.handlesX
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
    const handle = this.handlesX[this.track.getNearestPointIndex(point)]
    this.track.setActiveHandle(handle)
    const availablePoint = this.track.validatePoint(point)

    if (availablePoint !== handle.getPosition()) {
      handle.setPosition(availablePoint)

      this.notify(ModelUpdateTypes.Slide)
    }
  }

  updateHandleByIndex(point: number, index: number): void {
    if (!this.handlesX[index]) return

    const handle = this.handlesX[index]
    this.track.setActiveHandle(handle)
    const availablePoint = this.track.validatePoint(point)

    if (availablePoint !== handle.getPosition()) {
      handle.setPosition(availablePoint)

      this.notify(ModelUpdateTypes.Slide)
    }
  }

  updateHandlesByValues(values: number[]): void {
    this.handlesX.forEach((handle, i) => {
      if (values[i] !== undefined) {
        const point = this.converter.toTrackPoint(values[i], this.track.length)
        handle.setPosition(this.track.validatePoint(point))
      }
    })

    this.notify(ModelUpdateTypes.Slide)
  }

  resize(trackLength: number): void {
    this.values.forEach((value, i) => {
      const point = this.converter.toTrackPoint(value, trackLength)
      this.handlesX[i].setPosition(point)
    })

    this.track.length = trackLength

    // TODO: current method needs another update type
    this.notify(ModelUpdateTypes.Slide)
  }

  get rangeStartPosition(): number {
    return this.track.rangeStartPosition
  }

  get rangeEndPosition(): number {
    return this.track.rangeEndPosition
  }

  get handlePositions(): Point[] {
    return this.handlesX.map((handleX) => ({
      x: handleX.getPosition(),
      y: this.handleY.getPosition(),
    }))
  }

  get values(): number[] {
    return this.handlesX.map((handleX) =>
      Math.round(
        this.converter.toValue(handleX.getPosition(), this.track.length)
      )
    )
  }

  get ruler(): RulerSegment[] {
    return this._ruler.getSegments(this.options.rulerSteps)
  }
}

export default Model
