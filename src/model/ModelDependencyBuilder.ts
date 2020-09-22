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
import ValuesValidator from './ValuesValidator'

export interface ModelDependencies {
  input: Input
  track: Shape
  valuesValidator: ValuesValidator
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
    const valuesValidator = this.buildValuesValidator()
    const converter = this.buildConverter(valuesValidator, track)
    const calculator = this.buildCalculator()
    const trackPointValidator = this.buildTrackPointValidator(
      converter,
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
    const ruler = this.buildRuler(track, converter)

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
    return new Input(
      this.params.inputValuesSeparator,
      ...this.params.values.map((value) => value.toString())
    )
  }

  private buildTrack(): Shape {
    return { width: this.params.trackWidth, height: this.params.trackHeight }
  }

  private buildValuesValidator(): ValuesValidator {
    return new ValuesValidator(
      this.params.min,
      this.params.max,
      this.params.step
    )
  }

  private buildCalculator(): NearPointCalculator {
    return new NearPointCalculator()
  }

  private buildConverter(
    validator: ValuesValidator,
    track: Shape
  ): ValuesToTrackPointConverter {
    return new ValuesToTrackPointConverter(
      validator,
      track,
      new PrecisionFormatter()
    )
  }

  private buildTrackPointValidator(
    converter: ValuesToTrackPointConverter,
    track: Shape,
    calculator: NearPointCalculator
  ): TrackPointValidator {
    return new TrackPointValidator(converter, track, calculator)
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

  private buildRuler(
    track: Shape,
    converter: ValuesToTrackPointConverter
  ): Ruler {
    return new Ruler(track, converter, this.params.rulerSteps)
  }
}

export default ModelDependencyBuilder
