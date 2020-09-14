import Subject from '../utils/Subject'
import ModelParams from './ModelParams'
import { ModelEvents } from './ModelEvents'
import TrackPointValidator from './TrackPointValidator'
import RulerSegment from './RulerSegment'
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
import HandlesCollisionDetector from './HandlesCollisionDetector'
import PrecisionFormatter from './PrecisionFormatter'

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
  private collisionDetector: HandlesCollisionDetector
  private precisionFormatter: PrecisionFormatter
  private handler: (value: string) => void

  constructor({
    inputValuesSeparator: separator,
    trackHeight: height,
    trackWidth: width,
    rulerSteps,
    values,
    step,
    min,
    max,
  }: ModelParams) {
    super()

    this.input = new Input(separator, values.join(separator))

    this.track = { width, height }

    this.precisionFormatter = new PrecisionFormatter(step)

    this.converter = new ValuesToTrackPointConverter(min, max, step, this.track)

    this.validator = new TrackPointValidator(
      this.converter,
      this.track,
      this.handlesX,
      new NearPointCalculator()
    )

    values.forEach((value) => {
      const point = this.validator.validatePoint(
        this.converter.toTrackPoint(value)
      )
      this.handlesX.push(new HandleX(point))
    })
    this.handleY = new HandleY(this.track.height)

    this.fillerX = new FillerX(this.handlesX)
    this.fillerY = new FillerY()

    this.collisionDetector = new HandlesCollisionDetector(this.handlesX)

    this._ruler = new Ruler(this.track, this.converter, rulerSteps)
  }

  setMinValue(min: number | string): void {
    if (typeof min === 'string') min = +min

    const values = this.handlesX.map((handle) =>
      this.converter.toValue(handle.getPosition())
    )

    this.converter.setMin(min)

    values.forEach((value, i) => {
      const point = this.converter.toTrackPoint(value)
      this.handlesX[i].setPosition(point)
    })

    this.notify(ModelEvents.Update)
  }

  setMaxValue(max: number | string): void {
    if (typeof max === 'string') max = +max

    const values = this.handlesX.map((handle) =>
      this.converter.toValue(handle.getPosition())
    )

    this.converter.setMax(max)

    values.forEach((value, i) => {
      const point = this.converter.toTrackPoint(value)
      this.handlesX[i].setPosition(point)
    })

    this.notify(ModelEvents.Update)
  }

  setStep(step: number | string): void {
    if (typeof step === 'string') step = +step
    this.converter.setStep(step)
    this.precisionFormatter.setNumberWithTargetPrecision(step)

    this.notify(ModelEvents.Update)
  }

  addUpdateHandler(handler: (value: string) => void): void {
    this.handler = handler
  }

  updateHandle(point: number): void {
    const handle = this.handlesX[this.validator.getNearestPointIndex(point)]
    const oldPoint = handle.getPosition()
    const availablePoint = this.validator.validatePoint(point)
    handle.setPosition(availablePoint)

    if (this.collisionDetector.doCollide()) {
      handle.setPosition(oldPoint)
    } else if (oldPoint !== handle.getPosition()) {
      this.setInput()

      this.callHandler()

      this.notify(ModelEvents.Update)
    }
  }

  updateHandleByIndex(point: number, index: number): void {
    if (!this.handlesX[index]) return

    const handle = this.handlesX[index]
    const oldPoint = handle.getPosition()
    const availablePoint = this.validator.validatePoint(point)
    handle.setPosition(availablePoint)

    if (this.collisionDetector.doCollide()) {
      handle.setPosition(oldPoint)
    } else if (oldPoint !== handle.getPosition()) {
      this.setInput()

      this.callHandler()

      this.notify(ModelEvents.Update)
    }
  }

  updateFrom(value: number): void {
    const point = this.converter.toTrackPoint(value)
    this.handlesX[0].setPosition(this.validator.validatePoint(point))

    this.setInput()

    this.callHandler()

    this.notify(ModelEvents.Update)
  }

  updateTo(value: number): void {
    if (!this.handlesX[1]) return

    const point = this.converter.toTrackPoint(value)
    this.handlesX[1].setPosition(this.validator.validatePoint(point))

    this.setInput()

    this.callHandler()

    this.notify(ModelEvents.Update)
  }

  getFrom(): string {
    return this.handleToValue(this.handlesX[0])
  }

  getTo(): string {
    return this.handlesX[1] && this.handleToValue(this.handlesX[1])
  }

  updateHandlesByValues(values: number[]): void {
    this.handlesX.forEach((handle, i) => {
      if (values[i] !== undefined) {
        const point = this.converter.toTrackPoint(values[i])
        handle.setPosition(this.validator.validatePoint(point))
      }
    })

    this.callHandler()

    this.notify(ModelEvents.Update)
  }

  updateHandleByValue(value: number | string): void {
    if (typeof value === 'string') value = +value

    const point = this.converter.toTrackPoint(value)
    const handle = this.handlesX[this.validator.getNearestPointIndex(point)]
    handle.setPosition(this.validator.validatePoint(point))

    this.setInput()

    this.callHandler()

    this.notify(ModelEvents.Update)
  }

  resize(trackLength: number): void {
    this.handlesX.forEach((handle) => {
      const point = (trackLength / this.track.width) * handle.getPosition()
      handle.setPosition(point)
    })

    this.track.width = trackLength

    this.notify(ModelEvents.Update)
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
    return this._ruler.getSegments()
  }

  get inputValue(): string {
    return this.input.get()
  }

  private handleToValue(handle: HandleX): string {
    return this.precisionFormatter.format(
      this.converter.toValue(handle.getPosition())
    )
  }

  private setInput(): void {
    this.input.setFromList(
      this.handlesX.map((handle) => this.handleToValue(handle).toString())
    )
  }

  private callHandler() {
    this.handler && this.handler(this.input.get())
  }
}

export default Model
