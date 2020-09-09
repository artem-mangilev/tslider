import { Orientation } from './utils/aliases'

export default interface SliderOptions {
  min: number
  max: number
  from: number
  to?: number
  step: number
  showRuler?: boolean
  rulerSteps?: number
  isRulerClickable?: boolean
  showLabels?: boolean
  hideInput?: boolean
  inputValuesSeparator?: string
  targetInput: HTMLInputElement
  orientation: Orientation
}
