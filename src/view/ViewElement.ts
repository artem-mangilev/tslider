import Point from '../utils/Point'

// TODO: maybe split this to several interfaces?
export interface ViewElement {
  width: number
  height: number
  position: Point
  move(point: Point): void

  add(...elements: ViewElement[]): ViewElement
  after(element: ViewElement): void

  setContent(content: string): void
  getContent(): string

  show(): void
  hide(): void

  setAttribute(name: string, value: string): void

  shouldRerender(currentState: any, newState: any): boolean
}

export interface ViewElementEvents {
  listen(...elements: ViewElement[]): void

  click(handler: (e: ViewElementEvent) => void): void
  mouseDown(handler: (e: ViewElementEvent) => void): void
  touch(handler: (touch: ViewElementEvent) => void): void
  drag(handler: (e: ViewElementEvent) => void): void
  resize(handler: (size: ViewElementEvent) => void): void
  focusout(handler: (e: ViewElementEvent) => void): void
}

export interface ViewElementEvent {
  target: ViewElement
  point: Point
}
