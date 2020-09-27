import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../model/RulerSegment'
import RulerNode from './RulerNode'
import OrientationManager from './OrientationManager'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'

class Ruler implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__ruler')

  private nodes: RulerNode[] = []

  constructor(
    private om: OrientationManager,
    private permitter: RenderPermitter
  ) {}

  private init(ruler: RulerSegment[]) {
    ruler.forEach(() => this.nodes.push(new RulerNode(this.om)))
    this.element.add(...this.nodes.map((node) => node.element))

    this.init = undefined
  }

  render(ruler: RulerSegment[]): void {
    this.init && this.init(ruler)

    this.permitter.shouldRerender(ruler) &&
      ruler.forEach((segment, i) => {
        this.nodes[i].render({ segment, parent: this })
      })
  }

  onClick(handler: (e: MouseEvent) => void): void {
    this.element.onClick((e) => {
      const node = new ViewTreeNode(<HTMLElement>e.target)

      if (node.oneOf(this.nodes.map((node) => node.element)))
        handler(<MouseEvent>e)
    })
  }
}

export default Ruler
