import { Orientation } from './utils/aliases'

export default interface SliderOptions {
  min: number
  max: number
  from: number
  to?: number
  step: number
  ruler?: boolean
  rulerSteps?: number
  rulerActive?: boolean
  label?: boolean
  hideInput?: boolean
  inputValuesSeparator?: string
  targetInput: HTMLInputElement
  orientation: Orientation
}
