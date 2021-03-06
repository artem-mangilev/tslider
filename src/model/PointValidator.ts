import Shape from '../utils/Shape'
import NearPointCalculator from './NearPointCalculator'
import { ValuesStoreGetters } from './ValuesStore'

class PointValidator {
  constructor(
    private values: ValuesStoreGetters,
    private shape: Shape,
    private pointCalculator: NearPointCalculator
  ) {}

  validate(point: number): number {
    point = this.pointCalculator.fromSegment(point, this.stepSegment)

    if (this.isPointBeforeLeftBoundary(point)) {
      return this.leftBoundary
    } else if (this.isPointAfterRightBoundary(point)) {
      return this.rightBoundary
    }
    return point
  }

  private isPointBeforeLeftBoundary(point: number): boolean {
    return point <= this.leftBoundary
  }

  private isPointAfterRightBoundary(point: number): boolean {
    return point >= this.rightBoundary
  }

  private get leftBoundary(): number {
    return 0
  }

  private get rightBoundary(): number {
    return this.shape.width
  }

  private get stepSegment(): number {
    return this.shape.width / this.getNumberOfSteps()
  }

  private getNumberOfSteps(): number {
    return (this.values.getMax() - this.values.getMin()) / this.values.getStep()
  }
}

export default PointValidator
