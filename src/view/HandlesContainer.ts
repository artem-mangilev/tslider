import ViewTreeNode from '../utils/ViewTreeNode'

class HandlesContainer extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }
}

export default HandlesContainer
