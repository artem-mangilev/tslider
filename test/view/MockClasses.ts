import Point from '../../src/utils/Point'
import { RenderPermitter } from '../../src/view/RenderPermitter'
import { ViewElement } from '../../src/view/ViewElement'
import {
  ViewElementEventHandler,
  ViewElementObserver,
} from '../../src/view/ViewElementObserver'

export class MockElement implements ViewElement {
  width: 10
  height: 10
  position: Point = { x: 0, y: 0 }
  childs: ViewElement[] = []
  isHidden = false
  private attr = ''
  private content = ''

  add(...mockElements: ViewElement[]): void {
    this.childs = mockElements
  }

  after(): void {
    return
  }

  setAttribute(attr: string): void {
    this.attr = attr
  }

  getAttribute(): string {
    return this.attr
  }

  setContent(content: string): void {
    this.content = content
  }

  getContent(): string {
    return this.content
  }

  hide(): void {
    this.isHidden = true
  }

  show(): void {
    this.isHidden = false
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
