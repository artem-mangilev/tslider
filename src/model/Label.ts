import { OneDimensionalSpacePoint, Orientation } from '../utils/aliases'
import Point from '../utils/Point'

class Label {
  currentPosition: { x: number; y: number }

  constructor(
    public width: number,
    public height: number,
    initialPosition: Point,
  ) {
    this.move(initialPosition.x)
  }

  private get middle(): number {
    return this.width / 2
  }

  public move(whereTo: OneDimensionalSpacePoint): void {
    this.currentPosition = { x: whereTo - this.middle, y: 0 }
  }

  public get position(): Point {
    return this.currentPosition
  }
}

export default Label
