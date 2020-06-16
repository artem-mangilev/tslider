import { Orientation } from '../utils/aliases'
import ViewTreeNode from '../utils/ViewTreeNode'

class LabelsContainer extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  get width(): number {
    return this.$elem.width()
  }

  get height(): number {
    return this.$elem.height()
  }
}

export default LabelsContainer
