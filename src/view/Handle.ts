import Point from '../utils/Point'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'

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
