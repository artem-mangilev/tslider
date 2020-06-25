import { OrientationOption } from '../OrientationOptions'

// this interface is subset of SliderOptions, so
// TODO: find out how to avoid copy-pasting the fields
export default interface ViewOptions {
  targetInput: HTMLInputElement
  numberOfHandles: number
  orientationOption: OrientationOption
  label: boolean
}
