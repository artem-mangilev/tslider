import RulerSegment from '../model/RulerSegment'
import ViewComponent from './ViewComponent'
import { RenderPermitter } from './RenderPermitter'
import { ViewElement } from './ViewElement'
import HTMLViewElementClickObserver from './HTMLViewElementClickObserver'
import OrientationManager from './OrientationManager'

class Ruler implements ViewComponent {
  constructor(
    public element: ViewElement,
    private clickObserver: HTMLViewElementClickObserver,
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
      this.clickObserver.listen(...this.nodes.map((node) => node.element))
      this.clickObserver.bind((e) => handler(e.target.getContent()))
    }
  }
}

export default Ruler
