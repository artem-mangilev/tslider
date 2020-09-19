import { Orientation } from '../utils/aliases'
import Shape from '../utils/Shape'

class OrientationManager {
  constructor(private orientation: Orientation) {}

  getWidth(shape: Shape): number {
    if (this.isHorizontal()) {
      return shape.width
    }
    return shape.height
  }

  getHeight(shape: Shape): number {
    if (this.isHorizontal()) {
      return shape.height
    }
    return shape.width
  }

  private isHorizontal(): boolean {
    return this.orientation === 'horizontal'
  }

  private isVertical(): boolean {
    return this.orientation === 'vertical'
  }
}

export default OrientationManager
