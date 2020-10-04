import Point from '../../utils/Point'
import { ViewElement } from './ViewElement'

export interface ViewElementEvent {
  target: ViewElement
  targetIndex: number
  point?: Point
}

export type ViewElementEventHandler = (e: ViewElementEvent) => void

export interface ViewElementObserver {
  listen(...elements: ViewElement[]): void
  bind(handler: ViewElementEventHandler): void
}
