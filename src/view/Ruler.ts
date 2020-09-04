import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../RulerSegment'
import RulerNode from './RulerNode'

class Ruler extends ViewTreeNode {
  constructor(
    private longSide: 'width' | 'height',
    private x: 'x' | 'y',
    private y: 'x' | 'y'
  ) {
    super('div', 'tslider__ruler')
  }

  render(ruler: RulerSegment[]) {
    const nodes: RulerNode[] = []

    ruler.forEach(() => nodes.push(new RulerNode()))

    this.add(...nodes)

    ruler.forEach((segment, i) => {
      const node = nodes[i]

      node.setContent(segment.value.toString())

      const middle = node[this.longSide] / 2
      // @ts-ignore
      node.move({ [this.x]: segment.point - middle, [this.y]: 0 })
    })
  }
}

export default Ruler
