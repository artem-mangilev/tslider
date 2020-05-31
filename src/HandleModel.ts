import Point from './utils/Point'
import { OneDimensionalSpacePoint } from './aliases'

class HandleModel {
  private currentPosition: Point
  private passiveAxis: OneDimensionalSpacePoint

  constructor(initialPosition: Point) {
    // when this class is initialized, it assumes that
    // passed coordinate is for horizontal orientation,
    // so Y uses as a passive axis which isn't changes
    this.passiveAxis = initialPosition.y
    this.move(initialPosition.x)
  }

  public get position(): Point {
    return this.currentPosition
  }

  public move(whereTo: OneDimensionalSpacePoint): void {
    this.currentPosition = { x: whereTo, y: this.passiveAxis }

  }
}

export default HandleModel
