import { Orientation } from '../utils/aliases'
import Point from '../utils/Point'

class Range {
  startPos: Point

  constructor(
    private maxWidth: number,
    public height: number,
    initialStartPosition: Point,
    private orientation: Orientation
  ) {
    this.startPos = initialStartPosition
  }

  public get width(): number {
    return this.orientation === 'horizontal'
      ? this.startPosition.x
      : this.maxWidth - this.startPosition.x
  }

  public get startPosition(): Point {
    return this.startPos
  }

  public set startPosition(position: Point) {
    this.startPos = position
  }
}

export default Range
