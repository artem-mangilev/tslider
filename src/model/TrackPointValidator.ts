import Handle from './HandleX'
import Shape from '../utils/Shape'
import NearPointCalculator from './NearPointCalculator'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'

class TrackPointValidator {
  constructor(
    private converter: ValuesToTrackPointConverter,
    private track: Shape,
    private handles: Handle[],
    private pointCalculator: NearPointCalculator
  ) {
    this.handles = handles
  }

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
    if (this.isPointBeforeLeftBoundary(point)) {
      return this.leftBoundary
    } else if (this.isPointAfterRightBoundary(point)) {
      return this.rightBoundary
    }

    return this.pointCalculator.fromSegment(
      point,
      this.stepSegment,
      this.rightBoundary
    )
  }

  getNearestPointIndex(targetPoint: number): number {
    const points = this.handles.map((handle) => handle.getPosition())
    const nearest = this.pointCalculator.fromGroup(targetPoint, points)

    return points.findIndex((point) => point === nearest)
  }
}

export default TrackPointValidator
