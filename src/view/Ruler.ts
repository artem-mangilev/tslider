import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../model/RulerSegment'
import RulerNode from './RulerNode'
import { equals } from '../utils/equals'

class Ruler extends ViewTreeNode {
  private nodes: RulerNode[] = []
  private ruler: RulerSegment[] = []

  constructor(
    private longSide: 'width' | 'height',
    private x: 'x' | 'y',
    private y: 'x' | 'y'
  ) {
    super('div', 'tslider__ruler')
  }

  private init(ruler: RulerSegment[]) {
    ruler.forEach(() => this.nodes.push(new RulerNode()))
    this.add(...this.nodes)

    this.init = undefined
  }

  private shouldRender(ruler: RulerSegment[]): boolean {
    return !equals(this.ruler, ruler)
  }

  render(ruler: RulerSegment[]) {
    this.init && this.init(ruler)

    this.shouldRender(ruler) &&
      ruler.forEach((segment, i) => {
        const node = this.nodes[i]

        node.setContent(segment.value.toString())

        const middle = node[this.longSide] / 2
        // @ts-ignore
        node.move({ [this.x]: segment.point - middle, [this.y]: 0 })
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
