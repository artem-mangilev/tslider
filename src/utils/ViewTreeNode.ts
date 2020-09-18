import { equals } from './equals'
import Point from './Point'
import Shape from './Shape'
import { throttle } from './throttle'

export default class ViewTreeNode {
  $elem: JQuery<HTMLElement>

  constructor(element: string | HTMLElement, className?: string) {
    if (element instanceof HTMLElement) {
      this.$elem = $(element)
    }

    if (typeof element === 'string') {
      this.$elem = $(`<${element}>`, {
        class: className,
      })
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

  add(...nodes: ViewTreeNode[]): ViewTreeNode {
    nodes.forEach((node) => {
      if (node) {
        this.$elem.append(node.$elem)
      }
    })

    return this
  }

  oneOf(nodes: ViewTreeNode[]): boolean {
    return !!nodes.find((node) => node.$elem[0] === this.$elem[0])
  }

  find(nodes: ViewTreeNode[]): ViewTreeNode {
    return nodes.find((node) => node.$elem[0] === this.$elem[0])
  }

  move(position: Point): void {
    this.$elem.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }

  setContent(content: string): void {
    this.$elem.html(content)
  }

  getContent(): string {
    return this.$elem.html()
  }

  getElement(): HTMLElement {
    return this.$elem[0]
  }

  show(): void {
    this.$elem.css('position', 'static')
  }

  hide(): void {
    this.$elem.css('position', 'absolute').css('left', '-999px')
  }

  attr(name: string, value: string): void {
    this.$elem.attr(name, value)
  }

  after(node: ViewTreeNode): void {
    this.$elem.after(node.$elem)
  }

  shouldRender(currentState: any, newState: any): boolean {
    return !equals(currentState, newState)
  }

  onClick(handler: (e: Event) => void): void {
    this.$elem.on('click', handler)
  }

  onMouseDown(handler: (e: Event) => void): void {
    this.$elem.on('mousedown', handler)
  }

  onTouch(handler: (touch: Touch) => void): void {
    this.$elem.on('touchstart', (e) => {
      handler(e.touches[0])
    })
  }

  onDrag(handler: (e: Event) => void): void {
    const $root = $('html')
    $root.on('mousedown', ({ target }) => {
      if (target === this.$elem[0]) $root.on('mousemove', throttle(handler, 10))
    })
    $root.on('mouseup', () => $root.off('mousemove'))
  }

  onTouchDrag(handler: (touch: Touch) => void): void {
    const $root = $('html')
    $root.on('touchstart', ({ target }) => {
      if (target === this.$elem[0])
        $root.on(
          'touchmove',
          throttle((e: TouchEvent) => handler(e.touches[0]), 75)
        )
    })
    $root.on('touchend', () => $root.off('touchmove'))
  }

  onResize(handler: (size: Shape) => void): void {
    const ro = new ResizeObserver((entries) => {
      handler({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      })
    })

    ro.observe(this.$elem[0])
  }

  onFocusout(handler: (e: Event) => void): void {
    this.$elem.on('focusout', handler)
  }
}
