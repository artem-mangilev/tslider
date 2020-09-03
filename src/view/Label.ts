import ViewTreeNode from '../utils/ViewTreeNode'

class Label extends ViewTreeNode {
  constructor(
    className: string,
    private longSide: 'width' | 'height',
    private x: 'x' | 'y',
    private y: 'x' | 'y'
  ) {
    super('div', className)
  }

  render(data: { position: number; value: string }): void {
    this.setContent(data.value)

    // label should be placed in the middle of handle
    const middle = this[this.longSide] / 2
    // @ts-ignore
    this.move({ [this.x]: data.position - middle, [this.y]: 0 })
  }
}

export default Label
