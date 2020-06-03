export default class ViewTreeNode {
  $elem: JQuery<HTMLElement>

  constructor(elementName: string, className: string) {
    this.$elem = $(`<${elementName}>`, {
      class: className
    })
  }

  // TODO: maybe this method's name could be more short?
  public childs(...nodes: ViewTreeNode[]): ViewTreeNode {
    nodes.forEach((node) => this.$elem.append(node.$elem))

    return this
  }
}
