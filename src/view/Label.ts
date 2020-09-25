import ViewTreeNode from '../utils/ViewTreeNode'
import OrientationManager from './OrientationManager'
import ViewComponent from './ViewComponent'

export interface LabelRenderData {
  position: number
  value: string
}

class Label implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__label')
  private data: LabelRenderData

  constructor(private om: OrientationManager) {}

  render(data: LabelRenderData): void {
    if (this.element.shouldRender(this.data, data)) {
      this.element.setContent(data.value)

      const middle = this.om.getWidth(this.element) / 2
      this.element.move(this.om.getPoint({ x: data.position - middle, y: 0 }))
    }

    this.data = data
  }
}

export default Label
