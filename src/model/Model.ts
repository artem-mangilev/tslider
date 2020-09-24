import Subject from '../utils/Subject'
import { ModelEvents } from './ModelEvents'
import TrackPointValidator from './TrackPointValidator'
import RulerSegment from './RulerSegment'
import ValuesToPointConverter from './ValuesToPointConverter'
import Ruler from './Ruler'
import Shape from '../utils/Shape'
import HandleX from './HandleX'
import HandleY from './HandleY'
import FillerX from './FillerX'
import FillerY from './FillerY'
import TransferHandle from './TransferHandle'
import Input from './Input'
import ValuesStore from './ValuesStore'
import TransferFiller from './TransferFiller'
import HandlesXContainer from './HandlesXDirector'
import { ModelDependencies } from './ModelDependencyBuilder'
import PrecisionFormatter from './PrecisionFormatter'

class Model extends Subject {
  private validator: TrackPointValidator
  private converter: ValuesToPointConverter
  private _ruler: Ruler
  private track: Shape
  private handleY: HandleY
  private fillerX: FillerX
  private fillerY: FillerY
  private input: Input
  private handler: (value: string) => void
  private valuesStore: ValuesStore
  private handlesXContainer: HandlesXContainer
  private formatter: PrecisionFormatter

  constructor(deps: ModelDependencies) {
    super()

    this.input = deps.input
    this.track = deps.track
    this.valuesStore = deps.valuesStore
    this.converter = deps.converter
    this.validator = deps.trackPointValidator
    this.handlesXContainer = deps.handlesXContainer
    this.handleY = deps.handleY
    this.fillerX = deps.fillerX
    this.fillerY = deps.fillerY
    this._ruler = deps.ruler
    this.formatter = deps.formatter
  }

  setMinValue(min: number): void {
    this.setMinOrMax('min', min)

    this._ruler.update()
    this.performSettersRoutine()
  }

  getMinValue(): number {
    return this.valuesStore.getMin()
  }

  setMaxValue(max: number): void {
    this.setMinOrMax('max', max)

    this._ruler.update()
    this.performSettersRoutine()
  }

  getMaxValue(): number {
    return this.valuesStore.getMax()
  }

  setStep(step: number): void {
    this.valuesStore.setStep(step)

    this._ruler.update()
    this.notify(ModelEvents.Update)
  }

  getStep(): number {
    return this.valuesStore.getStep()
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

      const point = this.converter.toPoint(value)
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
    return this._ruler.get().map((point) => ({
      point,
      value: this.getFormattedValue(point),
    }))
  }

  get inputValue(): string {
    return this.input.get()
  }

  private handleToValue(handle: HandleX): string {
    return this.getFormattedValue(handle.getPosition())
  }

  private setInput(): void {
    const handles = this.handlesXContainer.getAll()
    this.input.set(...handles.map((handle) => this.handleToValue(handle)))
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
      const point = this.converter.toPoint(value)
      this.setHandleById(point, i)
    })
  }

  private setValue(which: 'from' | 'to', value: number) {
    if (isFinite(value)) {
      value = +value

      const point = this.converter.toPoint(value)
      this.setHandleById(point, which === 'from' ? 0 : 1)
    }
  }

  private setMinOrMax(which: 'min' | 'max', value: number) {
    const values = this.getValues()
    which === 'min'
      ? this.valuesStore.setMin(value)
      : this.valuesStore.setMax(value)
    this.setHandlesX(values)
  }

  private setHandleById(point: number, id: number): void {
    this.handlesXContainer.setById(this.validator.validatePoint(point), id)
  }

  private performSettersRoutine() {
    this.setInput()
    this.callHandler()
    this.notify(ModelEvents.Update)
  }

  private getFormattedValue(point: number): string {
    return this.formatter.format(
      this.valuesStore.getStep(),
      this.converter.toValue(point)
    )
  }
}

export default Model
