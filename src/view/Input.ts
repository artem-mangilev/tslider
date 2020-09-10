import ViewTreeNode from "../utils/ViewTreeNode"

class Input extends ViewTreeNode {
  constructor(private input: HTMLInputElement) {
    super(input)

    this.attr('type', 'hidden')
  }

  setValue(value: string): void {
    this.input.value = value
  }

  getValue(): string {
    return this.input.value
  }
}

export default Input
