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
import FillerX from './FillerX'
import FillerY from './FillerY'
import NearPointCalculator from './NearPointCalculator'
import TransferHandle from './TransferHandle'
import Input from './Input'
import HandlesCollisionDetector from './HandlesCollisionDetector'
import PrecisionFormatter from './PrecisionFormatter'
import ValuesValidator from './ValuesValidator'
import TransferFiller from './TransferFiller'
import HandlesXContainer from './HandlesXContainer'

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
  private handler: (value: string) => void
  private valuesValidator: ValuesValidator
  private handlesXContainer: HandlesXContainer

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

    this.valuesValidator = new ValuesValidator(min, max, step)

    this.converter = new ValuesToTrackPointConverter(
      this.valuesValidator,
      this.track,
      new PrecisionFormatter()
    )

    this.validator = new TrackPointValidator(
      this.converter,
      this.track,
      this.handlesX,
      new NearPointCalculator()
    )

    this.setHandlesX(values)
    this.collisionDetector = new HandlesCollisionDetector(this.handlesX)
    this.handlesXContainer = new HandlesXContainer(
      this.handlesX,
      this.collisionDetector
    )
    this.handleY = new HandleY(this.track.height)

    this.fillerX = new FillerX(this.handlesX)
    this.fillerY = new FillerY()

    this._ruler = new Ruler(this.track, this.converter, rulerSteps)
  }

  setMinValue(min: number): void {
    if (isFinite(min)) {
      min = +min

      const values = this.getValues()
      if (values.every((value) => value >= min)) {
        this.valuesValidator.setMin(min)
        this.setHandlesX(values)

        this._ruler.update()

        this.notify(ModelEvents.Update)
      }
    }
  }

  getMinValue(): number {
    return this.valuesValidator.getMin()
  }

  setMaxValue(max: number): void {
    if (isFinite(max)) {
      max = +max

      const values = this.getValues()
      if (values.every((value) => value <= max)) {
        this.valuesValidator.setMax(max)
        this.setHandlesX(values)

        this._ruler.update()

        this.notify(ModelEvents.Update)
      }
    }
  }

  getMaxValue(): number {
    return this.valuesValidator.getMax()
  }

  setStep(step: number): void {
    if (isFinite(step)) {
      step = +step

      this.valuesValidator.setStep(step)

      this.notify(ModelEvents.Update)
    }
  }

  getStep(): number {
    return this.valuesValidator.getStep()
  }

  setFrom(value: number): void {
    this.setValue('from', value)

    this.performSettersRoutine()
  }

  getFrom(): string {
    return this.handleToValue(this.handlesX[0])
  }

  setTo(value: number): void {
    this.setValue('to', value)

    this.performSettersRoutine()
  }

  getTo(): string {
    return this.handlesX[1] && this.handleToValue(this.handlesX[1])
  }

  setHandle(point: number): void {
    this.setHandleById(point, this.validator.getNearestPointIndex(point))

    this.performSettersRoutine()
  }

  setHandleByIndex(point: number, index: number): void {
    this.setHandleById(point, index)

    this.performSettersRoutine()
  }

  setHandleByValue(value: number): void {
    if (isFinite(value)) {
      value = +value

      const point = this.converter.toTrackPoint(value)
      this.setHandleById(point, this.validator.getNearestPointIndex(point))

      this.performSettersRoutine()
    }
  }

  resize(trackLength: number): void {
    const values = this.getValues()
    this.track.width = trackLength
    this.setHandlesX(values)

    this._ruler.update()

    this.notify(ModelEvents.Update)
  }

  addUpdateHandler(handler: (value: string) => void): void {
    this.handler = handler
  }

  get filler(): TransferFiller {
    return {
      position: {
        x: this.fillerX.getPosition(),
        y: this.fillerY.getPosition(),
      },
      length: this.fillerX.getLength(),
    }
  }

  get handles(): TransferHandle[] {
    return this.handlesX.map((handleX) => ({
      position: {
        x: handleX.getPosition(),
        y: this.handleY.getPosition(),
      },
      value: this.handleToValue(handleX),
    }))
  }

  get ruler(): RulerSegment[] {
    return this._ruler.get()
  }

  get inputValue(): string {
    return this.input.get()
  }

  private handleToValue(handle: HandleX): string {
    return this.converter.toFormattedValue(handle.getPosition())
  }

  private setInput(): void {
    this.input.setFromList(
      this.handlesX.map((handle) => this.handleToValue(handle))
    )
  }

  private callHandler() {
    this.handler && this.handler(this.input.get())
  }

  private getValues(): number[] {
    return this.handlesX.map((handle) =>
      this.converter.toValue(handle.getPosition())
    )
  }

  private setHandlesX(values: number[]): void {
    values.forEach((value, i) => {
      const point = this.converter.toTrackPoint(value)

      if (this.handlesX[i]) {
        this.handlesX[i].setPosition(point)
      } else {
        this.handlesX[i] = new HandleX(this.validator.validatePoint(point))
      }
    })
  }

  private setValue(which: 'from' | 'to', value: number) {
    if (isFinite(value)) {
      value = +value

      const point = this.converter.toTrackPoint(value)
      this.setHandleById(point, which === 'from' ? 0 : 1)
    }
  }

  private setHandleById(point: number, id: number): void {
    this.handlesXContainer.setById(this.validator.validatePoint(point), id)
  }

  private performSettersRoutine() {
    this.setInput()
    this.callHandler()
    this.notify(ModelEvents.Update)
  }
}

export default Model
