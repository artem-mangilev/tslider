import { Orientation, OneDimensionalSpacePoint } from './aliases'
import Point from './utils/Point'

class LabelModel {
  private passiveAxis: number
  currentPosition: { x: number; y: number }

  constructor(
    public width: number,
    public height: number,
    initialPosition: Point,
    private orientation: Orientation
  ) {
    this.passiveAxis = initialPosition.y
    this.move(initialPosition.x)
  }

  private get middle(): number {
    return this.orientation === 'horizontal' ? this.width / 2 : this.height / 2
  }

  public move(whereTo: OneDimensionalSpacePoint): void {
    switch (this.orientation) {
      case 'horizontal':
        this.currentPosition = { x: whereTo - this.middle, y: 0 }
        break
      case 'vetical':
        this.currentPosition = { x: 0, y: whereTo - this.middle }
        break
    }
  }

  public get position(): Point {
    return this.currentPosition
  }
}

export default LabelModel
