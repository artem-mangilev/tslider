import { Orientation } from './utils/aliases'

export type OrientationOptions = {
  [T in Orientation]?: OrientationOption
}

export type OrientationOption = {
  longSide: Side
  shortSide: Side
  activeAxis: Axis
  passiveAxis: Axis
}

export type Side = 'width' | 'height'

export type Axis = 'x' | 'y'
