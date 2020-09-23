import Shape from '../utils/Shape'
import NearPointCalculator from './NearPointCalculator'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'

class TrackPointValidator {
  constructor(
    private converter: ValuesToTrackPointConverter,
    private track: Shape,
    private pointCalculator: NearPointCalculator
  ) {}

  private isPointBeforeLeftBoundary(point: number): boolean {
    return point <= this.leftBoundary
  }

  private isPointAfterRightBoundary(point: number): boolean {
    return point >= this.rightBoundary
  }

  private get stepSegment(): number {
    return this.track.width / this.converter.getNumberOfSteps()
  }

  private get leftBoundary(): number {
    return 0
  }

  private get rightBoundary(): number {
    return this.track.width
  }

  validatePoint(point: number): number {
    point = this.pointCalculator.fromSegment(point, this.stepSegment)

    if (this.isPointBeforeLeftBoundary(point)) {
      return this.leftBoundary
    } else if (this.isPointAfterRightBoundary(point)) {
      return this.rightBoundary
    }
    return point
  }
}

export default TrackPointValidator
