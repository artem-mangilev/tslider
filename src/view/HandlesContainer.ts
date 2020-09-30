import Point from '../utils/Point'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'
import { ViewElement } from './ViewElement'
import { ViewElementObserver } from './ViewElementObserver'

type HandleDragHandler = (point: Point, id: number) => void

class HandlesContainer implements ViewComponent {
  constructor(
    public element: ViewElement,
    private dragObserver: ViewElementObserver,
    private permitter: RenderPermitter,
    private handles: ViewComponent[]
  ) {
    this.element.add(...this.handles.map((handle) => handle.element))
  }

  render(positions: Point[]): void {
    if (this.permitter.shouldRerender(positions)) {
      positions.forEach((position, i) => this.handles[i].render(position))
    }
  }

  onHandleDrag(handler: HandleDragHandler): void {
    this.dragObserver.listen(...this.handles.map((handle) => handle.element))
    this.dragObserver.bind((e) => handler(e.point, e.targetIndex))
  }
}

export default HandlesContainer
