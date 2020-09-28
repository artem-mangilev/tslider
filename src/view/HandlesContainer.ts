import Point from '../utils/Point'
import Handle from './Handle'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'
import { ViewElement } from './ViewElement'
import HTMLViewElement from "./HTMLViewElement"
import { ViewElementObserver } from './ViewElementObserver'

type HandleDragHandler = (point: Point, id: number) => void

class HandlesContainer implements ViewComponent {
  private handles: Handle[] = []

  constructor(
    public element: ViewElement,
    private dragObserver: ViewElementObserver,
    private permitter: RenderPermitter
  ) {}

  private init(positions: Point[]): void {
    this.handles = positions.map(
      () => new Handle(new HTMLViewElement('div', 'tslider__handle'))
    )
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
    this.dragObserver.listen(...this.handles.map((handle) => handle.element))
    this.dragObserver.bind((e) => handler(e.point, e.targetIndex))
  }
}

export default HandlesContainer
