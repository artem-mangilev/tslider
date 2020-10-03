import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import Track from '../../src/view/Track'
import { MockElement, MockObserver } from './MockClasses'
import ViewComponent from '../../src/view/ViewComponent'
chai.should()
chai.use(sinonChai)
const { expect } = chai

describe(Track.name, () => {
  let track: Track,
    element: MockElement,
    clickObserver: MockObserver,
    resizeObserver: MockObserver,
    range: ViewComponent,
    handles: ViewComponent

  beforeEach(() => {
    element = new MockElement()
    clickObserver = new MockObserver()
    resizeObserver = new MockObserver()
    range = {
      element: new MockElement(),
      render() {
        return
      },
    }
    handles = {
      element: new MockElement(),
      render() {
        return
      },
    }
    track = new Track(element, clickObserver, resizeObserver, range, handles)
  })

  describe('onClick', () => {
    it('should evaluate handler on target if click occurs', () => {
      const handler = sinon.spy()

      track.onClick(handler)
      clickObserver.trigger()

      expect(handler).to.have.been.called
    })
  })

  describe('onResize', () => {
    it('should evaluate handler on target if resize occurs', () => {
      const handler = sinon.spy()

      track.onResize(handler)
      resizeObserver.trigger()

      expect(handler).to.have.been.called
    })
  })
})
