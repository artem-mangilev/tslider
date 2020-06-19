import ViewTreeNode from '../utils/ViewTreeNode'

class HandlesContainer extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  get width(): number {
    return this.$elem.outerWidth()
  }

  get height(): number {
    return this.$elem.outerHeight()
  }
}

export default HandlesContainer
