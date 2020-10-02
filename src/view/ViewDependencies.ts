import OrientationManager from './OrientationManager'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'

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
