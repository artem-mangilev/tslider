import ViewTreeNode from '../utils/ViewTreeNode'
import ViewComponent from './ViewComponent'

class RulerNode implements ViewComponent {
  element = new ViewTreeNode('span', 'tslider__ruler-node')
}

export default RulerNode
