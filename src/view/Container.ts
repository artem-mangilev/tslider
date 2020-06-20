import ViewTreeNode from '../utils/ViewTreeNode'

class Container extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }
}

export default Container
