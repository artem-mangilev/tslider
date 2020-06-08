export default class ViewTreeNode {
  $elem: JQuery<HTMLElement>

  constructor(elementName: string, className: string) {
    this.$elem = $(`<${elementName}>`, {
      class: className
    })
  }

  public add(...nodes: ViewTreeNode[]): ViewTreeNode {
    nodes.forEach((node) => this.$elem.append(node.$elem))

    return this
  }
}
