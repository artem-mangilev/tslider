import { Orientation } from '../utils/aliases'

export default interface ModelOptions {
  step: number
  max: number
  min: number
  orientation: Orientation

  trackWidth: number
  trackHeight: number
  labelWidth: number
  labelHeight: number
}
