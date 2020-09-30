import { Orientation } from '../utils/aliases'

export default interface ViewParams {
  targetInput: HTMLInputElement
  orientation: Orientation
  showLabels: boolean
  showRuler: boolean
  isRulerClickable: boolean
  inputValuesSeparator: string
  handles: number
  rulerSteps: number
}
