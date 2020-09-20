import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../model/RulerSegment'
import RulerNode from './RulerNode'
import OrientationManager from './OrientationManager'

class Ruler extends ViewTreeNode {
  private nodes: RulerNode[] = []
  private ruler: RulerSegment[] = []

  constructor(private om: OrientationManager) {
    super('div', 'tslider__ruler')
  }

  private init(ruler: RulerSegment[]) {
    ruler.forEach(() => this.nodes.push(new RulerNode()))
    this.add(...this.nodes)

    this.init = undefined
  }

  render(ruler: RulerSegment[]) {
    this.init && this.init(ruler)

    this.shouldRender(this.ruler, ruler) &&
      ruler.forEach((segment, i) => {
        const node = this.nodes[i]

        node.setContent(segment.value)

        const point = this.om.decodePoint({ x: segment.point, y: 0 }, this)
        const middle = this.om.getWidth(node) / 2
        const alignedPoint = this.om.getPoint({
          x: this.om.getX(point) - middle,
          y: this.om.getY(point),
        })

        node.move(alignedPoint)
      })

    this.ruler = ruler
  }

  onClick(handler: (e: MouseEvent) => void): void {
    this.nodes.forEach((node) => node.onClick(handler))

    super.onClick((e) => {
      const node = new ViewTreeNode(<HTMLElement>e.target)
      if (node.oneOf(this.nodes)) handler(<MouseEvent>e)
    })
  }
}

export default Ruler
