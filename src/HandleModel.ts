import Point from './utils/Point'

class HandleModel {
  private currentPosition: Point

  constructor(initialPosition: Point) {
    this.currentPosition = initialPosition
  }

  public get position(): Point {
    return this.currentPosition
  }

  public set position(position: Point) {
    this.currentPosition = position
  }
}

export default HandleModel
