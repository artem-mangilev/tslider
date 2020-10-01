import Point from '../utils/Point'
import ViewComponent from './ViewComponent'

export interface ComponentEvent {
  target: ViewComponent
  targetIndex: number
  point?: Point
}

export type ComponentEventHandler = (e: ComponentEvent) => void

export interface ComponentObserver {
  listen(...components: ViewComponent[]): void
  bind(handler: ComponentEventHandler): void
}
