import { OrientationOption } from '../utils/OrientationOptions'

export default interface ViewParams {
  targetInput: HTMLInputElement
  orientationOption: OrientationOption
  showLabels: boolean
  showRuler: boolean
  isRulerClickable: boolean
  inputValuesSeparator: string
}
