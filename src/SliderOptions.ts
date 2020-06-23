import { Orientation } from './utils/aliases'

export default interface SliderOptions {
  min: number
  max: number
  from: number
  to?: number
  step?: number
  ruler?: boolean
  rulerSteps?: number
  rulerActive?: boolean
  targetInput: HTMLInputElement
  orientation: Orientation
}
