import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../RulerSegment'
import RulerNode from './RulerNode'

class Ruler extends ViewTreeNode {
  private nodes: RulerNode[]

  constructor(
    private longSide: 'width' | 'height',
    private x: 'x' | 'y',
    private y: 'x' | 'y'
  ) {
    super('div', 'tslider__ruler')

    this.nodes = []
  }

  private init(ruler: RulerSegment[]) {
    ruler.forEach(() => this.nodes.push(new RulerNode()))
    this.add(...this.nodes)
  }

  render(ruler: RulerSegment[]) {
    if (!this.nodes.length || ruler.length !== this.nodes.length) {
      this.init(ruler)
    }

    ruler.forEach((segment, i) => {
      const node = this.nodes[i]

      node.setContent(segment.value.toString())

      const middle = node[this.longSide] / 2
      // @ts-ignore
      node.move({ [this.x]: segment.point - middle, [this.y]: 0 })
    })
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
