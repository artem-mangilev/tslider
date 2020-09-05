import { Orientation } from '../utils/aliases'
import ViewTreeNode from '../utils/ViewTreeNode'

class SliderRoot extends ViewTreeNode {
  constructor(orientation: Orientation) {
    super('div', `tslider tslider_${orientation}`)
  }
}

export default SliderRoot
