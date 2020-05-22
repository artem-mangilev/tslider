import { Orientation } from './aliases'

export default interface SliderOptions {
  min: number
  max: number
  current: number
  step: number
  orientation: Orientation
  targetInput: HTMLInputElement
}
