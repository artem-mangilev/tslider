export interface RenderPermitter {
  shouldRerender(currentState: any, newState: any): boolean
}
