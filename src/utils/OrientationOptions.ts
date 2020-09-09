import { Orientation } from './aliases'

export type OrientationOptions = {
  [T in Orientation]?: OrientationOption
}

export type OrientationOption = {
  orientation: Orientation
  longSide: Side
  shortSide: Side
  x: Axis
  y: Axis
}

export type Side = 'width' | 'height'

export type Axis = 'x' | 'y'
