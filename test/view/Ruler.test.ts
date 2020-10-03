import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.should()
chai.use(sinonChai)
const { expect } = chai

import Ruler from '../../src/view/Ruler'
import ViewComponent from '../../src/view/ViewComponent'
import {
  MockElement,
  MockObserver,
  MockOrientationManager,
  MockPermitter,
} from './MockClasses'

describe(Ruler.name, () => {
  let ruler: Ruler,
    element: MockElement,
    observer: MockObserver,
    permitter: MockPermitter,
    om: MockOrientationManager,
    nodes: ViewComponent[]

  beforeEach(() => {
    element = new MockElement()
    observer = new MockObserver()
    permitter = new MockPermitter()
    om = new MockOrientationManager()
    nodes = [
      {
        element: new MockElement(),
        render() {
          return
        },
      },
      {
        element: new MockElement(),
        render() {
          return
        },
      },
    ]
    ruler = new Ruler(element, observer, permitter, true, om, nodes)
  })

  describe('constructor', () => {
    it('should put nodes to element of this component', () => {
      expect(element.childs.length).to.equal(2)
    })
  })

  describe('render', () => {
    it('should render ruler nodes', () => {
      sinon.spy(nodes[0], 'render')
      sinon.spy(nodes[1], 'render')

      ruler.render([
        { point: 10, value: '5' },
        { point: 100, value: '50' },
      ])

      expect(nodes[0].render).to.have.been.called
      expect(nodes[1].render).to.have.been.called
    })
  })

  describe('onClick', () => {
    it('should evaluate handler on node if click occurs', () => {
      const handler = sinon.spy()

      ruler.onClick(handler)
      observer.trigger()

      expect(handler).to.have.been.called
    })
  })
})
