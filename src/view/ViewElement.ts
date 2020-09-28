import Point from '../utils/Point'

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
}

class HTMLViewElement implements ViewElement {
  $elem: JQuery<HTMLElement>

  constructor(element: string | HTMLElement, className?: string) {
    if (element instanceof HTMLElement) {
      this.$elem = $(element)
    } else if (typeof element === 'string') {
      this.$elem = $(`<${element}>`, { class: className })
    }
  }

  get width(): number {
    return this.$elem.outerWidth()
  }

  get height(): number {
    return this.$elem.outerHeight()
  }

  set width(newWidth: number) {
    this.$elem.css('width', `${newWidth}px`)
  }

  set height(newHeight: number) {
    this.$elem.css('height', `${newHeight}px`)
  }

  get position(): Point {
    const { x, y } = this.$elem[0].getBoundingClientRect()

    return { x, y }
  }

  move(position: Point): void {
    this.$elem.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }

  add(...elements: ViewElement[]): void {
    elements.forEach((element) => {
      if (element instanceof HTMLViewElement) {
        this.$elem.append(element.$elem)
      }
    })
  }

  after(element: ViewElement): void {
    if (element instanceof HTMLViewElement) {
      this.$elem.after(element.$elem)
    }
  }

  setContent(content: string): void {
    this.$elem.html(content)
  }

  getContent(): string {
    return this.$elem.html()
  }

  show(): void {
    this.$elem.css('position', 'static')
  }

  hide(): void {
    this.$elem.css('position', 'absolute').css('left', '-999px')
  }

  setAttribute(name: string, value: string): void {
    this.$elem.attr(name, value)
  }
}

export default HTMLViewElement
