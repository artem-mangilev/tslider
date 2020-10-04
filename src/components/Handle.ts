import Point from '../utils/Point'
import ViewComponent from '../io/dom/ViewComponent'
import { ViewElement } from '../io/dom/ViewElement'

class Handle implements ViewComponent {
  constructor(public element: ViewElement) {}

  render(position: Point): void {
    const middle = this.element.width / 2

    this.element.move({
      x: position.x - middle,
      y: position.y - middle,
    })
  }
}

export default Handle
