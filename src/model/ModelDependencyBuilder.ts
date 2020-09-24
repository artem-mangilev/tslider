import Shape from '../utils/Shape'
import CollisionDetector from './CollisionDetector'
import FillerX from './FillerX'
import FillerY from './FillerY'
import HandlesXContainer from './HandlesXDirector'
import HandleY from './HandleY'
import Input from './Input'
import ModelParams from './ModelParams'
import NearPointCalculator from './NearPointCalculator'
import PrecisionFormatter from './PrecisionFormatter'
import Ruler from './Ruler'
import PointValidator from './PointValidator'
import ValuesStore, { ValuesStoreGetters } from './ValuesStore'
import NumberConverter from './NumberConverter'
import ValueToPointConverter from './ValueToPointConverter'
import PointToValueConverter from './PointToValueConverter'

export interface ModelDependencies {
  input: Input
  track: Shape
  valuesStore: ValuesStore
  valueToPointConverter: NumberConverter
  pointToValueConverter: NumberConverter
  pointValidator: PointValidator
  handlesXContainer: HandlesXContainer
  handleY: HandleY
  fillerX: FillerX
  fillerY: FillerY
  ruler: Ruler
  formatter: PrecisionFormatter
}

class ModelDependencyBuilder {
  constructor(private params: ModelParams) {}

  build(): ModelDependencies {
    const input = this.buildInput()
    const track = this.buildTrack()
    const valuesStore = this.buildValuesStore()
    const [valueToPointConverter, pointToValueConverter] = this.buildConverters(
      valuesStore,
      track
    )
    const calculator = this.buildCalculator()
    const pointValidator = this.buildPointValidator(
      valuesStore,
      track,
      calculator
    )
    const handlesXContainer = this.buildHandlesXContainer(
      pointValidator,
      valueToPointConverter,
      calculator
    )
    const handleY = this.buildHandleY()
    const fillerX = this.buildFillerX(handlesXContainer)
    const fillerY = this.buildFillerY()
    const ruler = this.buildRuler(track)
    const formatter = this.buildFormatter()

    return {
      input,
      track,
      valuesStore,
      valueToPointConverter,
      pointToValueConverter,
      pointValidator,
      handlesXContainer,
      handleY,
      fillerX,
      fillerY,
      ruler,
      formatter,
    }
  }

  private buildInput(): Input {
    const input = new Input(this.params.inputValuesSeparator)
    input.set(...this.params.values.map((value) => value.toString()))
    return input
  }

  private buildTrack(): Shape {
    return { width: this.params.trackWidth, height: this.params.trackHeight }
  }

  private buildValuesStore(): ValuesStore {
    return new ValuesStore(this.params.min, this.params.max, this.params.step)
  }

  private buildCalculator(): NearPointCalculator {
    return new NearPointCalculator()
  }

  private buildConverters(
    values: ValuesStoreGetters,
    track: Shape
  ): NumberConverter[] {
    return [
      new ValueToPointConverter(values, track),
      new PointToValueConverter(values, track),
    ]
  }

  private buildPointValidator(
    values: ValuesStoreGetters,
    track: Shape,
    calculator: NearPointCalculator
  ): PointValidator {
    return new PointValidator(values, track, calculator)
  }

  private buildHandlesXContainer(
    validator: PointValidator,
    valueToPointConverter: NumberConverter,
    calculator: NearPointCalculator
  ): HandlesXContainer {
    const handles = this.params.values.map((value) =>
      validator.validate(valueToPointConverter.convert(value))
    )
    return new HandlesXContainer(handles, new CollisionDetector(), calculator)
  }

  private buildHandleY() {
    return new HandleY(this.params.trackHeight)
  }

  private buildFillerX(container: HandlesXContainer): FillerX {
    const [leftHandle, rightHandle] = container.getAll()
    return new FillerX(leftHandle, rightHandle)
  }

  private buildFillerY(): FillerY {
    return new FillerY()
  }

  private buildRuler(track: Shape): Ruler {
    return new Ruler(track, this.params.rulerSteps)
  }

  private buildFormatter(): PrecisionFormatter {
    return new PrecisionFormatter()
  }
}

export default ModelDependencyBuilder
