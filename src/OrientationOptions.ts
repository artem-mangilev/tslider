import { Orientation } from './utils/aliases'

export type OrientationOptions = {
  [T in Orientation]?: OrientationOption
}

export type OrientationOption = {
  longSide: Side
  shortSide: Side
}

export type Side = 'width' | 'height'
