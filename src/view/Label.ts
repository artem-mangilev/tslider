import ViewTreeNode from '../utils/ViewTreeNode'

export interface LabelRenderData {
  position: number,
  value: string
}

class Label extends ViewTreeNode {
  constructor(
    private longSide: 'width' | 'height',
    private x: 'x' | 'y',
    private y: 'x' | 'y'
  ) {
    super('div', 'tslider__label')
  }

  render(data: LabelRenderData): void {
    this.setContent(data.value)

    const middle = this[this.longSide] / 2
    // @ts-ignore
    this.move({ [this.x]: data.position - middle, [this.y]: 0 })
  }
}

export default Label
