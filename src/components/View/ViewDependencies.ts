import { OrientationManager } from '../../utils/OrientationManager'
import ViewComponent from '../../io/dom/ViewComponent'
import { ViewElement } from '../../io/dom/ViewElement'

interface ViewDependencies {
  element: ViewElement
  input: ViewComponent
  track: ViewComponent
  handlesContainer: ViewComponent
  labelsContainer: ViewComponent
  range: ViewComponent
  ruler: ViewComponent
  om: OrientationManager
  showLabels: boolean
  showRuler: boolean
}

export default ViewDependencies
