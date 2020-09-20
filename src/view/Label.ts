import ViewTreeNode from '../utils/ViewTreeNode'
import OrientationManager from './OrientationManager'

export interface LabelRenderData {
  position: number
  value: string
}

class Label extends ViewTreeNode {
  private data: LabelRenderData

  constructor(private om: OrientationManager) {
    super('div', 'tslider__label')
  }

  render(data: LabelRenderData): void {
    if (this.shouldRender(this.data, data)) {
      this.setContent(data.value)

      const middle = this.om.getWidth(this) / 2
      this.move(this.om.getPoint({ x: data.position - middle, y: 0 }))
    }

    this.data = data
  }
}

export default Label
