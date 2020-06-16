import { Orientation } from './utils/aliases'

export type OrientationOptions = {
  [T in Orientation]?: OrientationOption
}

export type OrientationOption = {
  orientation: Orientation
  longSide: Side
  shortSide: Side
  x: Axis
  y: Axis
  direction: Direction
}

export type Side = 'width' | 'height'

export type Axis = 'x' | 'y'

export type Direction = 'left-to-right' | 'bottom-to-top'
