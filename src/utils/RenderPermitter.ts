import { equals } from './equals'

export interface RenderPermitter {
  shouldRerender(data: any): boolean
}

class RenderStatePermitter implements RenderPermitter {
  private state: unknown

  shouldRerender(state: unknown): boolean {
    const shouldRerender = !equals(this.state, state)
    this.state = state
    return shouldRerender
  }
}

export default RenderStatePermitter
