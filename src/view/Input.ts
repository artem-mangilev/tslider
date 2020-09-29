import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'

class Input implements ViewComponent {
  constructor(public element: ViewElement) {
    this.element.setAttribute('type', 'hidden')
  }

  render(value: string): void {
    this.element.setAttribute('value', value)
  }

  getValue(): string {
    return this.element.getAttribute('value')
  }
}

export default Input
