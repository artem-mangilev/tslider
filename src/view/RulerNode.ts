import ViewTreeNode from '../utils/ViewTreeNode'

class RulerNode extends ViewTreeNode {
  constructor(className: string) {
    super('span', className)
  }
}

export default RulerNode
