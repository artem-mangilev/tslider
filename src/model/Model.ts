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
import CollisionDetector from './CollisionDetector'
import PrecisionFormatter from './PrecisionFormatter'
import ValuesValidator from './ValuesValidator'
import TransferFiller from './TransferFiller'
import HandlesXContainer from './HandlesXContainer'

class Model extends Subject {
  private validator: TrackPointValidator
  private converter: ValuesToTrackPointConverter
  private _ruler: Ruler
  private track: Shape
  private handleY: HandleY
  private fillerX: FillerX
  private fillerY: FillerY
  private input: Input
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

    const calculator = new NearPointCalculator()

    this.validator = new TrackPointValidator(
      this.converter,
      this.track,
      calculator
    )

    const handlesX = values.map((value) =>
      this.validator.validatePoint(this.converter.toTrackPoint(value))
    )
    this.handlesXContainer = new HandlesXContainer(
      handlesX,
      new CollisionDetector(),
      calculator
    )
    this.handleY = new HandleY(this.track.height)

    this.fillerX = new FillerX(this.handlesXContainer.getAll())
    this.fillerY = new FillerY()

    this._ruler = new Ruler(this.track, this.converter, rulerSteps)
  }

  setMinValue(min: number): void {
    this.setMinOrMax('min', min)
  }

  getMinValue(): number {
    return this.valuesValidator.getMin()
  }

  setMaxValue(max: number): void {
    this.setMinOrMax('max', max)
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
    return this.handleToValue(this.handlesXContainer.getById(0))
  }

  setTo(value: number): void {
    this.setValue('to', value)

    this.performSettersRoutine()
  }

  getTo(): string {
    const to = this.handlesXContainer.getById(1)
    return to && this.handleToValue(to)
  }

  setHandle(point: number): void {
    this.handlesXContainer.setNear(this.validator.validatePoint(point))

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
      this.handlesXContainer.setNear(this.validator.validatePoint(point))

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
    return this.handlesXContainer.getAll().map((handleX) => ({
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
      this.handlesXContainer
        .getAll()
        .map((handle) => this.handleToValue(handle))
    )
  }

  private callHandler() {
    this.handler && this.handler(this.input.get())
  }

  private getValues(): number[] {
    return this.handlesXContainer
      .getAll()
      .map((handle) => this.converter.toValue(handle.getPosition()))
  }

  private setHandlesX(values: number[]): void {
    values.forEach((value, i) => {
      const point = this.converter.toTrackPoint(value)
      this.setHandleById(point, i)
    })
  }

  private setValue(which: 'from' | 'to', value: number) {
    if (isFinite(value)) {
      value = +value

      const point = this.converter.toTrackPoint(value)
      this.setHandleById(point, which === 'from' ? 0 : 1)
    }
  }

  private setMinOrMax(which: 'min' | 'max', value: number) {
    if (isFinite(value)) {
      value = +value

      const values = this.getValues()
      which === 'min'
        ? this.valuesValidator.setMin(value)
        : this.valuesValidator.setMax(value)
      this.setHandlesX(values)

      this._ruler.update()

      this.notify(ModelEvents.Update)
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
