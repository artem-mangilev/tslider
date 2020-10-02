import Point from '../utils/Point'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'
import { ViewElement } from './ViewElement'
import {
  ViewElementEventHandler,
  ViewElementObserver,
} from './ViewElementObserver'

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

  onDrag(handler: ViewElementEventHandler): void {
    this.dragObserver.listen(...this.handles.map((handle) => handle.element))
    this.dragObserver.bind(handler)
  }
}

export default HandlesContainer
