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
import TrackPointValidator from './TrackPointValidator'
import ValuesToPointConverter from './ValuesToPointConverter'
import ValuesStore, { ValuesStoreGetters } from './ValuesStore'

export interface ModelDependencies {
  input: Input
  track: Shape
  valuesStore: ValuesStore
  converter: ValuesToPointConverter
  trackPointValidator: TrackPointValidator
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
    const converter = this.buildConverter(valuesStore, track)
    const calculator = this.buildCalculator()
    const trackPointValidator = this.buildTrackPointValidator(
      valuesStore,
      track,
      calculator
    )
    const handlesXContainer = this.buildHandlesXContainer(
      trackPointValidator,
      converter,
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
      converter,
      trackPointValidator,
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

  private buildConverter(
    values: ValuesStoreGetters,
    track: Shape
  ): ValuesToPointConverter {
    return new ValuesToPointConverter(values, track)
  }

  private buildTrackPointValidator(
    values: ValuesStoreGetters,
    track: Shape,
    calculator: NearPointCalculator
  ): TrackPointValidator {
    return new TrackPointValidator(values, track, calculator)
  }

  private buildHandlesXContainer(
    validator: TrackPointValidator,
    converter: ValuesToPointConverter,
    calculator: NearPointCalculator
  ): HandlesXContainer {
    const handles = this.params.values.map((value) =>
      validator.validatePoint(converter.toPoint(value))
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
