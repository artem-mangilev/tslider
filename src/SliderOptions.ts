import { Orientation } from './aliases'

export default interface SliderOptions {
  min: number
  max: number
  current: number
  step: number,
  labelMarginFromTrack: number
  orientation: Orientation
  targetInput: HTMLInputElement
}
