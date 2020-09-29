import HandlesContainer from "./HandlesContainer";
import Input from "./Input";
import LabelsContainer from "./LabelsContainer";
import OrientationManager from "./OrientationManager";
import Range from "./Range";
import Ruler from "./Ruler";
import ViewComponent from "./ViewComponent";
import { ViewElement } from "./ViewElement";

interface ViewDependencies {
  element: ViewElement
  input: Input
  track: ViewComponent
  handlesContainer: HandlesContainer
  labelsContainer: LabelsContainer
  range: Range
  ruler: Ruler
  om: OrientationManager
  showLabels: boolean
  showRuler: boolean
}

export default ViewDependencies
