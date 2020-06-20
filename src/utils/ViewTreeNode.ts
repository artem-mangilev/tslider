import Point from "./Point"

export default class ViewTreeNode {
  $elem: JQuery<HTMLElement>

  constructor(elementName: string, className: string) {
    this.$elem = $(`<${elementName}>`, {
      class: className,
    })
  }

  get width(): number {
    return this.$elem.outerWidth()
  }

  get height(): number {
    return this.$elem.outerHeight()
  }

  set width(newWidth: number) {
    this.$elem.css('width', `${newWidth}px`)
  }

  set height(newHeight: number) {
    this.$elem.css('height', `${newHeight}px`)
  }

  public get position(): Point {
    const { x, y } = this.$elem[0].getBoundingClientRect()

    return { x, y }
  }

  public add(...nodes: ViewTreeNode[]): ViewTreeNode {
    nodes.forEach((node) => this.$elem.append(node.$elem))

    return this
  }
}
