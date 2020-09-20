import ViewTreeNode, { MouseEventOrTouch } from '../utils/ViewTreeNode'
import Point from '../utils/Point'
import Handle from './Handle'

type HandleDragHandler = (point: Point, id: number) => void

class HandlesContainer extends ViewTreeNode {
  private handles: Handle[] = []

  private data: Point[]

  constructor() {
    super('div', 'tslider__handles')
  }

  private init(positions: Point[]): void {
    this.handles = [...positions.map(() => new Handle())]
    this.add(...this.handles)

    this.init = undefined
  }

  render(positions: Point[]): void {
    this.init && this.init(positions)

    if (this.shouldRender(this.data, positions)) {
      positions.forEach((position, i) => this.handles[i].move(position))
    }

    this.data = positions
  }

  onHandleDrag(handler: HandleDragHandler): void {
    const mouseDownOrTouchHandler = (e: MouseEventOrTouch) => {
      const handle = new ViewTreeNode(<HTMLElement>e.target).find(this.handles)
      const index = this.handles.indexOf(handle)
      handle?.onDrag((e: MouseEvent) =>
        handler({ x: e.clientX, y: e.clientY }, index)
      )
    }

    this.onMouseDown(mouseDownOrTouchHandler)
    this.onTouch(mouseDownOrTouchHandler)
  }
}

export default HandlesContainer
