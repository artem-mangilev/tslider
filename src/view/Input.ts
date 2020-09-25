import ViewTreeNode from "../utils/ViewTreeNode"
import ViewComponent from "./ViewComponent"

class Input implements ViewComponent {
  element: ViewTreeNode

  constructor(private input: HTMLInputElement) {
    this.element = new ViewTreeNode(input)

    this.element.attr('type', 'hidden')
  }

  setValue(value: string): void {
    this.input.value = value
  }

  getValue(): string {
    return this.input.value
  }
}

export default Input
