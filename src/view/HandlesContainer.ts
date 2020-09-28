import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'
import Handle from './Handle'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'

type HandleDragHandler = (point: Point, id: number) => void

class HandlesContainer implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__handles')
  private handles: Handle[] = []

  constructor(private permitter: RenderPermitter) {}

  private init(positions: Point[]): void {
    this.handles = positions.map(() => new Handle())
    this.element.add(...this.handles.map((handle) => handle.element))

    this.init = undefined
  }

  render(positions: Point[]): void {
    this.init && this.init(positions)

    if (this.permitter.shouldRerender(positions)) {
      positions.forEach((position, i) => this.handles[i].render(position))
    }
  }

  onHandleDrag(handler: HandleDragHandler): void {
    this.handles.forEach((handle, index) => {
      handle.element.onDrag((e: MouseEvent) => {
        handler({ x: e.clientX, y: e.clientY }, index)
      })
    })
  }
}

export default HandlesContainer
