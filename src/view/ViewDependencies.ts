import HandlesContainer from "./HandlesContainer";
import OrientationManager from "./OrientationManager";
import Ruler from "./Ruler";
import ViewComponent from "./ViewComponent";
import { ViewElement } from "./ViewElement";

interface ViewDependencies {
  element: ViewElement
  input: ViewComponent
  track: ViewComponent
  handlesContainer: HandlesContainer
  labelsContainer: ViewComponent
  range: ViewComponent
  ruler: Ruler
  om: OrientationManager
  showLabels: boolean
  showRuler: boolean
}

export default ViewDependencies
