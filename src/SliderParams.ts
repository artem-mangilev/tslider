import { Orientation } from './utils/aliases'

export default interface SliderParams {
  min: number
  max: number
  from: number
  to?: number
  step: number
  showRuler?: boolean
  rulerSteps?: number
  isRulerClickable?: boolean
  showLabels?: boolean
  inputValuesSeparator?: string
  targetInput: HTMLInputElement
  orientation: Orientation
}
