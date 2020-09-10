import Point from './Point'
import Shape from './Shape'

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

  show(): void {
    this.$elem.css('visibility', 'visible')
  }

  hide(): void {
    this.$elem.css('visibility', 'hidden')
  }

  after(node: ViewTreeNode): void {
    this.$elem.after(node.$elem)
  }

  onClick(handler: (e: Event) => void): void {
    this.$elem.on('click', handler)
  }

  onMouseDown(handler: (e: Event) => void): void {
    this.$elem.on('mousedown', handler)
  }

  onDrag(handler: (e: Event) => void): void {
    const $root = $('html')

    $root.on('mousedown', ({ target }) => {
      if (target === this.$elem[0]) $root.on('mousemove', handler)
    })

    $root.on('mouseup', () => $root.off('mousemove'))
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
