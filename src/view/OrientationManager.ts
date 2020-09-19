import { Orientation } from '../utils/aliases'
import Point from '../utils/Point'
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

  encodePoint(point: Point, shape: Shape): Point {
    if (this.isHorizontal()) {
      return point
    }
    return {
      x: this.getWidth(shape) - point.y,
      y: point.x,
    }
  }

  decodePoint(point: Point, shape: Shape): Point {
    if (this.isHorizontal()) {
      return point
    }
    return {
      x: point.y,
      y: this.getWidth(shape) - point.x
    }
  }

  private isHorizontal(): boolean {
    return this.orientation === 'horizontal'
  }

  private isVertical(): boolean {
    return this.orientation === 'vertical'
  }
}

export default OrientationManager
