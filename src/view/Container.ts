import ViewTreeNode from '../utils/ViewTreeNode'

class Container extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)

    // this.$elem = $('<div>', {
    //   class: className,
    // })
  }

  public get width(): number {
    return this.$elem.width()
  }

  public get height(): number {
    return this.$elem.height()
  }
}

export default Container
