import Point from './utils/Point'
import { Orientation, OneDimensionalSpacePoint } from './aliases'

class HandleModel {
  private currentPosition: Point
  private passiveAxis: OneDimensionalSpacePoint

  constructor(initialPosition: Point, private orientation: Orientation) {
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
    switch (this.orientation) {
      case 'horizontal':
        this.currentPosition = { x: whereTo, y: this.passiveAxis }
        break
      case 'vetical':
        this.currentPosition = { x: this.passiveAxis, y: whereTo }
    }
  }

  public getActiveAxisPoint(point: Point): OneDimensionalSpacePoint {
    switch (this.orientation) {
      case 'horizontal':
        return point.x
      case 'vetical':
        return point.y
    }
  }

  public get currentPositionActiveAxis(): OneDimensionalSpacePoint {
    return this.getActiveAxisPoint(this.position)
  }
}

export default HandleModel
