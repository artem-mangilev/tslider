import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'
import Handle from './Handle'

class HandlesContainer extends ViewTreeNode {
  private handles: Handle[] = []

  constructor() {
    super('div', 'tslider__handles')
  }

  private init(positions: Point[]): void {
    this.handles = [...positions.map(() => new Handle())]
    this.add(...this.handles)
  }

  render(positions: Point[]): void {
    if (!this.handles.length) this.init(positions)

    positions.forEach((position, i) => this.handles[i].move(position))
  }

  onHandleDrag(handler: (point: Point, id: number) => void): void {
    this.onMouseDown(({ target }) => {
      const handle = new ViewTreeNode(<HTMLElement>target).find(this.handles)
      handle &&
        handle.onDrag((e: MouseEvent) =>
          handler({ x: e.clientX, y: e.clientY }, this.handles.indexOf(handle))
        )
    })
  }
}

export default HandlesContainer
