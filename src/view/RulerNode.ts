import ViewTreeNode from '../utils/ViewTreeNode'

class RulerNode extends ViewTreeNode {
  constructor(className: string) {
    super('span', className)
  }

  public get value(): string {
    return this.$elem.html()
  }

  public set value(value: string) {
    this.$elem.html(value)
  }
}

export default RulerNode
