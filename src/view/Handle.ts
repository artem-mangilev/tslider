import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'
import ViewComponent from './ViewComponent'

class Handle implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__handle')

  render(position: Point): void {
    const middle = this.element.width / 2

    this.element.move({
      x: position.x - middle,
      y: position.y - middle,
    })
  }
}

export default Handle
