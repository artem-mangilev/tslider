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
    private permitter: RenderPermitter,
    private clickable: boolean
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
    this.clickable &&
      this.nodes.forEach((node) => node.element.onClick(handler))
  }
}

export default Ruler
