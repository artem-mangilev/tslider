import { OrientationOption } from '../utils/OrientationOptions'

export default interface ViewParams {
  targetInput: HTMLInputElement
  orientationOption: OrientationOption
  showLabels: boolean
  showRuler: boolean
  isRulerClickable: boolean
  hideInput: boolean
  inputValuesSeparator: string
}
