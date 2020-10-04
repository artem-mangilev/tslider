import Point from '../../utils/Point'

// TODO: maybe split this to several interfaces?
export interface ViewElement {
  width: number
  height: number
  position: Point
  move(point: Point): void

  add(...elements: ViewElement[]): void
  after(element: ViewElement): void

  setContent(content: string): void
  getContent(): string

  show(): void
  hide(): void

  setAttribute(name: string, value: string): void
  getAttribute(name: string): string
}
