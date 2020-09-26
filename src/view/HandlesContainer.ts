import ViewTreeNode, { MouseEventOrTouch } from '../utils/ViewTreeNode'
import Point from '../utils/Point'
import Handle from './Handle'
import ViewComponent from './ViewComponent'

type HandleDragHandler = (point: Point, id: number) => void

class HandlesContainer implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__handles')
  private handles: Handle[] = []

  private data: Point[]

  private init(positions: Point[]): void {
    this.handles = positions.map(() => new Handle())
    this.element.add(...this.handles.map((handle) => handle.element))

    this.init = undefined
  }

  render(positions: Point[]): void {
    this.init && this.init(positions)

    if (this.element.shouldRender(this.data, positions)) {
      positions.forEach((position, i) => this.handles[i].render(position))
    }

    this.data = positions
  }

  onHandleDrag(handler: HandleDragHandler): void {
    const mouseDownOrTouchHandler = (e: MouseEventOrTouch) => {

      const handle = new ViewTreeNode(<HTMLElement>e.target).find(
        this.handles.map((handle) => handle.element)
      )

      const index = this.handles.map((handle) => handle.element).indexOf(handle)

      handle?.onDrag((e: MouseEvent) =>
        handler({ x: e.clientX, y: e.clientY }, index)
      )
    }
    // TODO: maybe it's possible to listen drag event without these events?
    this.element.onMouseDown(mouseDownOrTouchHandler)
    this.element.onTouch(mouseDownOrTouchHandler)
  }
}

export default HandlesContainer
