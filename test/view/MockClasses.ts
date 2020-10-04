import { Orientation } from '../../src/utils/aliases'
import { CollisionDetector } from '../../src/utils/CollisionDetector'
import Point from '../../src/utils/Point'
import Shape from '../../src/utils/Shape'
import { OrientationManager } from '../../src/view/OrientationManager'
import { RenderPermitter } from '../../src/view/RenderPermitter'
import { ViewElement } from '../../src/view/ViewElement'
import {
  ViewElementEventHandler,
  ViewElementObserver,
} from '../../src/view/ViewElementObserver'

export class MockElement implements ViewElement {
  width = 10
  height = 10
  position: Point = { x: 0, y: 0 }
  childs: ViewElement[] = []
  afterElement: ViewElement
  isShown = true
  private attrs: { [x: string]: string }
  private content = ''

  add(...mockElements: ViewElement[]): void {
    this.childs = mockElements
  }

  after(mockElement: ViewElement): void {
    this.afterElement = mockElement
  }

  setAttribute(attrName: string, value: string): void {
    this.attrs = { [attrName]: value }
  }

  getAttribute(attrName: string): string {
    return this.attrs[attrName]
  }

  setContent(content: string): void {
    this.content = content
  }

  getContent(): string {
    return this.content
  }

  hide(): void {
    this.isShown = false
  }

  show(): void {
    this.isShown = true
  }

  move(position: Point): void {
    this.position = position
  }
}

export class MockObserver implements ViewElementObserver {
  elements: ViewElement[]
  handler: ViewElementEventHandler

  listen(...mockElements: ViewElement[]): void {
    this.elements = mockElements
  }

  bind(handler: ViewElementEventHandler): void {
    this.handler = handler
  }

  trigger(): void {
    this.elements.forEach((element, i) => {
      this.handler({ target: element, targetIndex: i })
    })
  }
}

export class MockPermitter implements RenderPermitter {
  shouldRerender(): boolean {
    return true
  }
}

export class MockCollisionDetector implements CollisionDetector {
  collisionState = false

  doCollide(): boolean {
    return this.collisionState
  }

  setCollisionState(state: boolean): void {
    this.collisionState = state
  }
}

export class MockOrientationManager implements OrientationManager {
  private orientation: Orientation = 'horizontal'

  decodePoint(point: Point): Point {
    return point
  }

  encodePoint(point: Point): Point {
    return point
  }

  getX(point: Point): number {
    return point.x
  }

  getY(point: Point): number {
    return point.y
  }

  getPoint(point: Point): Point {
    return point
  }

  getWidth(shape: Shape): number {
    return shape.width
  }
  getHeight(shape: Shape): number {
    return shape.height
  }

  setWidth(shape: Shape, width: number): void {
    if (this.orientation === 'horizontal') {
      shape.width = width
    } else {
      shape.height = width
    }
  }

  isHorizontal(): boolean {
    return this.orientation === 'horizontal'
  }

  isVertical(): boolean {
    return this.orientation === 'vertical'
  }

  changeOrientation(orientation: Orientation): void {
    this.orientation = orientation
  }
}
