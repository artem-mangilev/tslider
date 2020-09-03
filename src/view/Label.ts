import ViewTreeNode from '../utils/ViewTreeNode'

class Label extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  render(data: {
    position: number
    value: string
    longSide: 'width' | 'height'
    x: 'x' | 'y',
    y: 'x' | 'y'
  }): void {
    this.setContent(data.value)

    // label should be placed in the middle of handle
    const middle = this[data.longSide] / 2
    // @ts-ignore
    this.move({ [data.x]: data.position - middle, [data.y]: 0 })
  }
}

export default Label
