import Subject from '../utils/Subject'
import ModelOptions from './ModelOptions'
import { ModelUpdateTypes } from './ModelUpdateTypes'
import TrackPointValidator from './TrackPointValidator'
import RulerSegment from '../RulerSegment'
import Observer from '../utils/Observer'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'
import Ruler from './Ruler'
import Shape from '../utils/Shape'
import HandleX from './HandleX'
import HandleY from './HandleY'
import Point from '../utils/Point'
import FillerX from './FillerX'
import FillerY from './FillerY'
import NearPointCalculator from './NearPointCalculator'
import TransferHandle from './TransferHandle'
import Input from './Input'

class Model extends Subject {
  private validator: TrackPointValidator
  private handlesX: HandleX[] = []
  private converter: ValuesToTrackPointConverter
  private _ruler: Ruler
  private track: Shape
  private handleY: HandleY
  private fillerX: FillerX
  private fillerY: FillerY
  private input: Input

  constructor(private options: ModelOptions, observer?: Observer) {
    super()

    this.input = new Input(
      options.inputValuesSeparator,
      options.values.join(options.inputValuesSeparator)
    )

    this.converter = new ValuesToTrackPointConverter(
      options.min,
      options.max,
      options.step
    )

    this.track = {
      width: options.trackWidth,
      height: options.trackHeight,
    }

    this.handleY = new HandleY(this.track.height)

    options.values.forEach((data) => {
      const point = this.converter.toTrackPoint(data, this.track.width)
      this.handlesX.push(new HandleX(point))
    })

    this.fillerX = new FillerX(this.handlesX)
    this.fillerY = new FillerY()

    this.validator = new TrackPointValidator(
      this.converter.getNumberOfSteps(),
      this.track,
      this.handlesX,
      new NearPointCalculator()
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
    const handle = this.handlesX[this.validator.getNearestPointIndex(point)]
    this.validator.setActiveHandle(handle)
    const availablePoint = this.validator.validatePoint(point)

    if (availablePoint !== handle.getPosition()) {
      handle.setPosition(availablePoint)

      this.setInput()

      this.notify(ModelUpdateTypes.Slide)
    }
  }

  updateHandleByIndex(point: number, index: number): void {
    if (!this.handlesX[index]) return

    const handle = this.handlesX[index]
    this.validator.setActiveHandle(handle)
    const availablePoint = this.validator.validatePoint(point)

    if (availablePoint !== handle.getPosition()) {
      handle.setPosition(availablePoint)

      this.setInput()

      this.notify(ModelUpdateTypes.Slide)
    }
  }

  updateHandlesByValues(values: number[]): void {
    this.handlesX.forEach((handle, i) => {
      if (values[i] !== undefined) {
        const point = this.converter.toTrackPoint(values[i], this.track.width)
        handle.setPosition(this.validator.validatePoint(point))
      }
    })

    this.setInput()

    this.notify(ModelUpdateTypes.Slide)
  }

  updateHandlesByInput(input: string): void {
    this.input.set(input)

    this.input.getAsList().forEach((value, i) => {
      const point = this.converter.toTrackPoint(value, this.track.width)
      this.handlesX[i].setPosition(this.validator.validatePoint(point))
    })

    this.notify(ModelUpdateTypes.Slide)
  }

  resize(trackLength: number): void {
    this.values.forEach((value, i) => {
      const point = this.converter.toTrackPoint(value, trackLength)
      this.handlesX[i].setPosition(point)
    })

    this.track.width = trackLength

    // TODO: current method needs another update type
    this.notify(ModelUpdateTypes.Slide)
  }

  get rangeLength(): number {
    return this.fillerX.getLength()
  }

  get rangePosition(): Point {
    return {
      x: this.fillerX.getPosition(),
      y: this.fillerY.getPosition(),
    }
  }

  get handlePositions(): Point[] {
    return this.handlesX.map((handleX) => ({
      x: handleX.getPosition(),
      y: this.handleY.getPosition(),
    }))
  }

  get values(): number[] {
    return this.handlesX.map((handleX) => this.handleToValue(handleX))
  }

  get handles(): TransferHandle[] {
    return this.handlesX.map((handleX) => ({
      position: {
        x: handleX.getPosition(),
        y: this.handleY.getPosition(),
      },
      value: this.handleToValue(handleX).toString(),
    }))
  }

  get ruler(): RulerSegment[] {
    return this._ruler.getSegments(this.options.rulerSteps)
  }

  get inputValue(): string {
    return this.input.get()
  }

  private handleToValue(handle: HandleX): number {
    return Math.round(
      this.converter.toValue(handle.getPosition(), this.track.width)
    )
  }

  private setInput(): void {
    this.input.setFromList(
      this.handlesX.map((handle) => this.handleToValue(handle).toString())
    )
  }
}

export default Model
