import RulerSegment from '../model/RulerSegment'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'
import { ViewElement } from './ViewElement'
import HTMLViewElementClickObserver from './HTMLViewElementClickObserver'

class Ruler implements ViewComponent {
  constructor(
    public element: ViewElement,
    private clickObserver: HTMLViewElementClickObserver,
    private permitter: RenderPermitter,
    private clickable: boolean,
    private nodes: ViewComponent[]
  ) {}

  private init() {
    this.element.add(...this.nodes.map((node) => node.element))

    this.init = undefined
  }

  render(ruler: RulerSegment[]): void {
    this.init && this.init()

    this.permitter.shouldRerender(ruler) &&
      ruler.forEach((segment, i) =>
        this.nodes[i].render({ segment, parent: this })
      )
  }

  onClick(handler: (value: string) => void): void {
    if (this.clickable) {
      this.clickObserver.listen(...this.nodes.map((node) => node.element))
      this.clickObserver.bind((e) => handler(e.target.getContent()))
    }
  }
}

export default Ruler
