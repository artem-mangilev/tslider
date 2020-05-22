import { Orientation } from "./aliases";

export interface SliderOptions {
  min: number
  max: number
  current: number
  step: number
  orientation: Orientation
  targetInput: HTMLInputElement
}
