import ViewTreeNode from '../utils/ViewTreeNode'

class Label extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }
}

export default Label
