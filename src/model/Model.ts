import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Point from '../utils/Point'
import Subject from '../utils/Subject'
import Data from './Data'
import Handle from './Handle'
import ModelOptions from './ModelOptions'
import { ModelUpdateTypes } from './ModelUpdateTypes'
import Track from './Track'

// TODO: simplify implementation of switching the orientation
class Model extends Subject {
  private track: Track
  private data: Data
  private handles: Handle[] = []

  constructor(private options: ModelOptions) {
    super()
  }

  public get rangeStartPosition(): OneDimensionalSpacePoint {
    return this.track.rangeStartPosition
  }

  public get rangeEndPosition(): OneDimensionalSpacePoint {
    return this.track.rangeEndPosition
  }

  public get handlePositions(): OneDimensionalSpacePoint[] {
    return this.handles.map((handle) => handle.position)
  }

  public initSlider(handlesData: number[]): void {
    // initialize the data
    this.data = new Data(this.options.min, this.options.max, this.options.step)

    // initialize track class
    this.track = new Track(this.data.numberOfSteps, this.options.trackLength)

    handlesData.forEach((data) => {
      const dataRatio = this.data.getAmountAsRatio(data)

      const coordinate: OneDimensionalSpacePoint = dataRatio * this.track.length
      this.handles.push(new Handle(coordinate))
    })

    this.track.registerHandles(this.handles)

    this.notify(ModelUpdateTypes.Initialization)
  }

  // TODO: create different name for this method
  public moveHandle(
    targetPoint: OneDimensionalSpacePoint,
    handleIndex?: number
  ): void {
    // these condition help the Model to decide should it compute which handle should be used,
    // or use a provided handleIndex
    let activeHandleIndex =
      handleIndex === undefined
        ? this.track.getNearestPointIndex(targetPoint)
        : handleIndex

    const activeHandle = this.handles[activeHandleIndex]

    this.track.setActiveHandle(activeHandle)

    const availablePoint = this.track.getAvailablePoint(targetPoint)

    // this is just an optimisation to avoid dummy renders 
    // (when nothing actually changes in the screen) in view 
    if (availablePoint !== activeHandle.position) {
      activeHandle.position = availablePoint

      this.notify(ModelUpdateTypes.Slide)
    }
  }

  get dataAmount(): number[] {
    const handlePositionRatios: Ratio[] = this.handlePositions.map((position) =>
      this.track.pointToRatio(position)
    )

    return handlePositionRatios.map((ratio) => this.data.getAmount(ratio))
  }
}

export default Model
