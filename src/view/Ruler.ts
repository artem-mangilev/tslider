import RulerSegment from '../model/RulerSegment'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'
import { ViewElement } from './ViewElement'
import HTMLComponentClickObserver from './HTMLComponentClickObserver'
import OrientationManager from './OrientationManager'

class Ruler implements ViewComponent {
  constructor(
    public element: ViewElement,
    private clickObserver: HTMLComponentClickObserver,
    private permitter: RenderPermitter,
    private clickable: boolean,
    private om: OrientationManager,
    private nodes: ViewComponent[]
  ) {
    this.element.add(...this.nodes.map((node) => node.element))
  }

  render(ruler: RulerSegment[]): void {
    if (!this.permitter.shouldRerender(ruler)) return

    if (this.om.isVertical()) {
      ruler = ruler.map(({ point }, i, array) => {
        const value = array[array.length - i - 1].value
        return { point, value }
      })
    }

    ruler.forEach((segment, i) => this.nodes[i].render({ segment }))
  }

  onClick(handler: (value: string) => void): void {
    if (this.clickable) {
      this.clickObserver.listen(...this.nodes)
      this.clickObserver.bind((e) => handler(e.target.element.getContent()))
    }
  }
}

export default Ruler
