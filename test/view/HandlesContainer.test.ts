import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.should()
chai.use(sinonChai)
const { expect } = chai

import HandlesContainer from '../../src/components/HandlesContainer'
import ViewComponent from '../../src/io/dom/ViewComponent'
import { MockElement, MockObserver, MockPermitter } from './MockClasses'

describe(HandlesContainer.name, () => {
  let container: ViewComponent,
    observer: MockObserver,
    element: MockElement,
    handle: ViewComponent

  beforeEach(() => {
    handle = {
      element: new MockElement(),
      render() {
        return
      },
    }
    element = new MockElement()
    observer = new MockObserver()
    container = new HandlesContainer(element, observer, new MockPermitter(), [
      handle,
    ])
  })

  describe('constructor', () => {
    it('should put handles to element of this component', () => {
      expect(element.childs.length).to.equal(1)
    })
  })

  describe('render', () => {
    it('should render handles', () => {
      sinon.spy(handle, 'render')

      container.render([{ x: 0, y: 0 }])

      expect(handle.render).to.have.been.called
    })
  })

  describe('onDrag', () => {
    it('should evaluate handler on handle if drag occurs', () => {
      const handler = sinon.spy()

      container.onDrag(handler)
      observer.trigger()

      expect(handler).to.have.been.called
    })
  })
})
