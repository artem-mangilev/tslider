import RulerSegment from '../model/RulerSegment'
import ViewTreeNode from '../utils/ViewTreeNode'
import OrientationManager from './OrientationManager'
import ViewComponent from './ViewComponent'

export interface RulerNodeRenderData {
  segment: RulerSegment
  parent: ViewComponent
}

class RulerNode implements ViewComponent {
  element = new ViewTreeNode('span', 'tslider__ruler-node')

  constructor(private om: OrientationManager) {}

  render(data: RulerNodeRenderData): void {
    this.element.setContent(data.segment.value)

    const point = this.om.decodePoint(
      { x: data.segment.point, y: 0 },
      data.parent.element
    )
    const middle = this.om.getWidth(this.element) / 2
    const alignedPoint = this.om.getPoint({
      x: this.om.getX(point) - middle,
      y: this.om.getY(point),
    })

    this.element.move(alignedPoint)
  }
}

export default RulerNode
