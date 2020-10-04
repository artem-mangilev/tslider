import RulerSegment from '../model/RulerSegment'
import ViewComponent from '../io/dom/ViewComponent'
import { RenderPermitter } from '../utils/RenderPermitter'
import { ViewElement } from '../io/dom/ViewElement'
import { OrientationManager } from '../utils/OrientationManager'
import {
  ViewElementEventHandler,
  ViewElementObserver,
} from '../io/dom/ViewElementObserver'

class Ruler implements ViewComponent {
  constructor(
    public element: ViewElement,
    private clickObserver: ViewElementObserver,
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

  onClick(handler: ViewElementEventHandler): void {
    if (this.clickable) {
      this.clickObserver.listen(...this.nodes.map((node) => node.element))
      this.clickObserver.bind(handler)
    }
  }
}

export default Ruler
