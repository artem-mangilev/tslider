import ViewTreeNode from "../utils/ViewTreeNode"

class Input extends ViewTreeNode {
  constructor(private input: HTMLInputElement, hide: boolean) {
    super(input)

    hide ? this.hide() : this.show()
  }

  setValue(value: string): void {
    this.input.value = value
  }

  getValue(): string {
    return this.input.value
  }
}

export default Input
