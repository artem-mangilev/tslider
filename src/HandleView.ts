class HandleView {
  $handle: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$handle = $(element)
  }

  get size(): number {
    const width = this.$handle.width()
    const height = this.$handle.height()

    if (width === height) {
      return width
    }

    throw 'Width and height of the handle have to be the same.'
  }
}

export default HandleView
