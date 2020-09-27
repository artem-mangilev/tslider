import ViewTreeNode from '../utils/ViewTreeNode'
import OrientationManager from './OrientationManager'
import { RenderPermitter } from './RenderPermitter'
import ViewComponent from './ViewComponent'

export interface LabelRenderData {
  position: number
  value: string
}

class Label implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__label')

  constructor(
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
