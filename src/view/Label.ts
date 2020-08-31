import ViewTreeNode from '../utils/ViewTreeNode'

class Label extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  updateData(newData: string): void {
    this.$elem.html(newData)
  }

  get data(): string {
    return this.$elem.html()
  }
}

export default Label
