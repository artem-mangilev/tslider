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
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'
import ValuesStore from './ValuesStore'

export interface ModelDependencies {
  input: Input
  track: Shape
  valuesValidator: ValuesStore
  converter: ValuesToTrackPointConverter
  trackPointValidator: TrackPointValidator
  handlesXContainer: HandlesXContainer
  handleY: HandleY
  fillerX: FillerX
  fillerY: FillerY
  ruler: Ruler
}

class ModelDependencyBuilder {
  constructor(private params: ModelParams) {}

  build(): ModelDependencies {
    const input = this.buildInput()
    const track = this.buildTrack()
    const valuesValidator = this.buildValuesStore()
    const converter = this.buildConverter(valuesValidator, track)
    const calculator = this.buildCalculator()
    const trackPointValidator = this.buildTrackPointValidator(
      valuesValidator,
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

    return {
      input,
      track,
      valuesValidator,
      converter,
      trackPointValidator,
      handlesXContainer,
      handleY,
      fillerX,
      fillerY,
      ruler,
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
    validator: ValuesStore,
    track: Shape
  ): ValuesToTrackPointConverter {
    return new ValuesToTrackPointConverter(
      validator,
      track,
      new PrecisionFormatter()
    )
  }

  private buildTrackPointValidator(
    values: ValuesStore,
    track: Shape,
    calculator: NearPointCalculator
  ): TrackPointValidator {
    return new TrackPointValidator(values, track, calculator)
  }

  private buildHandlesXContainer(
    validator: TrackPointValidator,
    converter: ValuesToTrackPointConverter,
    calculator: NearPointCalculator
  ): HandlesXContainer {
    const handles = this.params.values.map((value) =>
      validator.validatePoint(converter.toTrackPoint(value))
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
}

export default ModelDependencyBuilder
