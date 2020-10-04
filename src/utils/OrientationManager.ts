import { Orientation } from './aliases'
import Point from './Point'
import Shape from './Shape'

export interface OrientationManager {
  getWidth(shape: Shape): number
  getHeight(shape: Shape): number
  setWidth(shape: Shape, width: number): void
  getX(point: Point): number
  getY(point: Point): number
  getPoint(point: Point): Point
  encodePoint(point: Point, shape: Shape): Point
  decodePoint(point: Point, shape: Shape): Point
  isHorizontal(): boolean
  isVertical(): boolean
}

class ShapeOrientationManager {
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

  setWidth(shape: Shape, width: number): void {
    if (this.isHorizontal()) {
      shape.width = width
    } else {
      shape.height = width
    }
  }

  getX(point: Point): number {
    if (this.isHorizontal()) {
      return point.x
    }
    return point.y
  }

  getY(point: Point): number {
    if (this.isHorizontal()) {
      return point.y
    }
    return point.x
  }

  getPoint(point: Point): Point {
    if (this.isHorizontal()) {
      return point
    }
    return { x: point.y, y: point.x }
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
      y: this.getWidth(shape) - point.x,
    }
  }

  isHorizontal(): boolean {
    return this.orientation === 'horizontal'
  }

  isVertical(): boolean {
    return this.orientation === 'vertical'
  }
}

export default ShapeOrientationManager
