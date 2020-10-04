import { OrientationManager } from '../utils/OrientationManager'
import { RenderPermitter } from '../utils/RenderPermitter'
import ViewComponent from '../io/dom/ViewComponent'
import { ViewElement } from '../io/dom/ViewElement'

export interface LabelRenderData {
  position: number
  value: string
}

class Label implements ViewComponent {
  constructor(
    public element: ViewElement,
    private om: OrientationManager,
    private permitter: RenderPermitter
  ) {}

  render(data: LabelRenderData): void {
    if (this.permitter.shouldRerender(data)) {
      this.element.setContent(data.value)

      const middle = this.om.getWidth(this.element) / 2
      this.element.move(this.om.getPoint({ x: data.position - middle, y: 0 }))
    }
  }
}

export default Label
