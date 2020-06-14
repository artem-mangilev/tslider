import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Handle from './Handle'

class Track {
  private stepSegment: number
  private handles: Handle[]
  private activeHandle: Handle
  private firstHandle: Handle
  private lastHandle: Handle

  constructor(private numberOfSteps: number, public length: number) {
    this.stepSegment = this.length / this.numberOfSteps
    this.activeHandle = null
  }

  private getNearStep(point: OneDimensionalSpacePoint) {
    return Math.round(point / this.stepSegment)
  }

  public get leftBoundry(): number {
    return 0
  }

  private get rightBoundry(): number {
    return this.length
  }

  private get firstPointPosition(): OneDimensionalSpacePoint {
    return this.firstHandle.position
  }

  public get lastPointPosition(): OneDimensionalSpacePoint {
    return this.lastHandle.position
  }

  private isPointBetweenPoints(point: OneDimensionalSpacePoint): boolean {
    return point >= this.firstPointPosition && point <= this.lastPointPosition
  }

  private isPointBeforeLeftBoundry(point: OneDimensionalSpacePoint): boolean {
    return point <= this.leftBoundry
  }

  private isPointAfterRightBoundry(point: OneDimensionalSpacePoint): boolean {
    return point >= this.rightBoundry
  }

  private isPointCollidesWithLastPoint(
    point: OneDimensionalSpacePoint
  ): boolean {
    const isPointAfterLastPoint = point > this.lastHandle.position

    return this.activeHandle === this.firstHandle && isPointAfterLastPoint
  }

  private isPointCollidesWithFirstPoint(
    point: OneDimensionalSpacePoint
  ): boolean {
    const isPointBeforeFirstPoint = point < this.firstHandle.position

    return this.activeHandle === this.lastHandle && isPointBeforeFirstPoint
  }

  public getAvailablePoint(
    targetPoint: OneDimensionalSpacePoint
  ): OneDimensionalSpacePoint {
    const isPointCollidesWithLastPoint =
      this.isRangeMode() && this.isPointCollidesWithLastPoint(targetPoint)

    const isPointCollidesWithFirstPoint =
      this.isRangeMode() && this.isPointCollidesWithFirstPoint(targetPoint)

    if (isPointCollidesWithLastPoint) {
      return this.lastPointPosition
    } else if (isPointCollidesWithFirstPoint) {
      return this.firstPointPosition
    } else if (this.isPointBeforeLeftBoundry(targetPoint)) {
      return this.leftBoundry
    } else if (this.isPointAfterRightBoundry(targetPoint)) {
      return this.rightBoundry
    }

    const availablePointRatio: Ratio =
      this.getNearStep(targetPoint) / this.numberOfSteps
    const availablePoint: OneDimensionalSpacePoint =
      availablePointRatio * this.length

    return availablePoint
  }

  private isRangeMode(): boolean {
    return this.handles.length === 2
  }

  // TODO: improve naming
  public getClothestPointIndex(targetPoint: OneDimensionalSpacePoint): number {
    const firstPointIndex: number = 0
    const lastPointIndex: number = this.handles.length - 1

    const firstPoint: number = this.firstHandle.position
    const lastPoint: number = this.lastHandle.position

    const firstLastMiddle: number = (lastPoint + firstPoint) / 2

    const isTargetPointIsFirstPoint: boolean = targetPoint === firstPoint
    const isTargetPointIsLastPoint: boolean = targetPoint === lastPoint
    const isTargetPointBeforeFirstPoint: boolean = targetPoint < firstPoint
    const isTargetPointAfterLastPoint: boolean = targetPoint > lastPoint
    const isTargetPointBetweenPoints: boolean = this.isPointBetweenPoints(
      targetPoint
    )
    const isTargetPointCloserToFirstPoint: boolean =
      isTargetPointBetweenPoints && targetPoint <= firstLastMiddle
    const isTargetPointCloserToLastPoint: boolean =
      isTargetPointBetweenPoints && targetPoint > firstLastMiddle

    if (
      isTargetPointIsFirstPoint ||
      isTargetPointBeforeFirstPoint ||
      isTargetPointCloserToFirstPoint
    ) {
      return firstPointIndex
    } else if (
      isTargetPointIsLastPoint ||
      isTargetPointAfterLastPoint ||
      isTargetPointCloserToLastPoint
    ) {
      return lastPointIndex
    }
  }

  public pointToRatio(point: OneDimensionalSpacePoint): Ratio {
    return point / this.length
  }

  // TODO: probably it's not a good idea to register handles in the track explicitly
  public registerHandles(handles: Handle[]) {
    this.handles = handles
    this.firstHandle = this.handles[0]
    this.lastHandle = this.handles[this.handles.length - 1]
  }

  public setActiveHandle(handle: Handle | null) {
    this.activeHandle = handle
  }

  public get boundriesDistance(): number {
    return this.isRangeMode()
      ? this.lastHandle.position - this.firstHandle.position
      : this.firstHandle.position
  }

  public get rangeStartPosition(): OneDimensionalSpacePoint {
    return this.isRangeMode() ? this.firstHandle.position : this.leftBoundry
  }
}

export default Track
