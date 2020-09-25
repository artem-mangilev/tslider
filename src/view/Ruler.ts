import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../model/RulerSegment'
import RulerNode from './RulerNode'
import OrientationManager from './OrientationManager'
import ViewComponent from './ViewComponent'

class Ruler implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__ruler')
  
  private nodes: RulerNode[] = []
  private ruler: RulerSegment[] = []

  constructor(private om: OrientationManager) {}

  private init(ruler: RulerSegment[]) {
    ruler.forEach(() => this.nodes.push(new RulerNode()))
    this.element.add(...this.nodes.map((node) => node.element))

    this.init = undefined
  }

  render(ruler: RulerSegment[]) {
    this.init && this.init(ruler)

    this.element.shouldRender(this.ruler, ruler) &&
      ruler.forEach((segment, i) => {
        const node = this.nodes[i]

        node.element.setContent(segment.value)

        const point = this.om.decodePoint(
          { x: segment.point, y: 0 },
          this.element
        )
        const middle = this.om.getWidth(node.element) / 2
        const alignedPoint = this.om.getPoint({
          x: this.om.getX(point) - middle,
          y: this.om.getY(point),
        })

        node.element.move(alignedPoint)
      })

    this.ruler = ruler
  }

  onClick(handler: (e: MouseEvent) => void): void {
    this.nodes.forEach((node) => node.element.onClick(handler))

    this.element.onClick((e) => {
      const node = new ViewTreeNode(<HTMLElement>e.target)
      if (node.oneOf(this.nodes.map((node) => node.element)))
        handler(<MouseEvent>e)
    })
  }
}

export default Ruler
