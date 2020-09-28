import RulerSegment from '../model/RulerSegment'
import RulerNode from './RulerNode'
import OrientationManager from './OrientationManager'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'
import { ViewElement } from './ViewElement'
import HTMLViewElement from "./HTMLViewElement"
import HTMLViewElementClickObserver from './HTMLViewElementClickObserver'

class Ruler implements ViewComponent {
  private nodes: RulerNode[] = []

  constructor(
    public element: ViewElement,
    private clickObserver: HTMLViewElementClickObserver,
    private om: OrientationManager,
    private permitter: RenderPermitter,
    private clickable: boolean
  ) {}

  private init(ruler: RulerSegment[]) {
    ruler.forEach(() =>
      this.nodes.push(
        new RulerNode(
          new HTMLViewElement('span', 'tslider__ruler-node'),
          this.om
        )
      )
    )
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

  onClick(handler: (value: string) => void): void {
    if (this.clickable) {
      this.clickObserver.listen(...this.nodes.map((node) => node.element))
      this.clickObserver.bind((e) => handler(e.target.getContent()))
    }
  }
}

export default Ruler
