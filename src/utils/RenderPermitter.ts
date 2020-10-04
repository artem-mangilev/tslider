export interface RenderPermitter {
  shouldRerender(data: unknown): boolean
}

class RenderStatePermitter implements RenderPermitter {
  private state: unknown

  shouldRerender(state: unknown): boolean {
    const shouldRerender = !this.equals(this.state, state)
    this.state = state
    return shouldRerender
  }

  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  private equals(a: any, b: any): boolean {
    if (a === b) {
      return true
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime()
    }

    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
      return a === b
    }

    if (a.prototype !== b.prototype) {
      return false
    }

    const keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) {
      return false
    }

    return keys.every((k) => this.equals(a[k], b[k]))
  }
}

export default RenderStatePermitter
