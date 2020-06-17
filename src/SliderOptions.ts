import { Orientation } from './utils/aliases'

export default interface SliderOptions {
  min: number
  max: number
  from: number
  to?: number
  step?: number
  targetInput: HTMLInputElement
  orientation: Orientation
}
