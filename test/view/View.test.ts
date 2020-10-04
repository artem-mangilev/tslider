import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.should()
chai.use(sinonChai)
const { expect } = chai

import View, { ViewRenderData } from '../../src/view/View'
import ViewComponent from '../../src/view/ViewComponent'
import { MockElement, MockOrientationManager } from './MockClasses'

describe(View.name, () => {
  let view: View,
    element: MockElement,
    input: ViewComponent,
    track: ViewComponent,
    handlesContainer: ViewComponent,
    labelsContainer: ViewComponent,
    range: ViewComponent,
    ruler: ViewComponent,
    om: MockOrientationManager

  beforeEach(() => {
    element = new MockElement()
    input = {
      element: new MockElement(),
      render() {
        return
      },
    }
    track = {
      element: new MockElement(),
      render() {
        return
      },
    }
    handlesContainer = {
      element: new MockElement(),
      render() {
        return
      },
    }
    labelsContainer = {
      element: new MockElement(),
      render() {
        return
      },
    }
    range = {
      element: new MockElement(),
      render() {
        return
      },
    }
    ruler = {
      element: new MockElement(),
      render() {
        return
      },
    }
    om = new MockOrientationManager()
    const showLabels = true
    const showRuler = true
    view = new View({
      element,
      input,
      track,
      handlesContainer,
      labelsContainer,
      range,
      ruler,
      om,
      showLabels,
      showRuler,
    })
  })

  describe('constructor', () => {
    it('should put dependenant component elements to element of this component', () => {
      expect(element.childs.length).to.equal(5)
    })

    it('should put element of this component after input', () => {
      if (input.element instanceof MockElement) {
        expect(input.element.afterElement).to.equal(view.element)
      }
    })
  })

  describe('render', () => {
    it('should render some of the dependant components', () => {
      sinon.spy(handlesContainer, 'render')
      sinon.spy(range, 'render')
      sinon.spy(labelsContainer, 'render')
      sinon.spy(input, 'render')
      sinon.spy(ruler, 'render')

      const data: ViewRenderData = {
        handles: [
          {
            position: {
              x: 0,
              y: 0,
            },
            value: 'hello world',
          },
        ],
        filler: {
          position: {
            x: 0,
            y: 0,
          },
          length: 0,
        },
        inputValue: 'hello world',
        ruler: [
          {
            point: 0,
            value: '0',
          },
        ],
      }

      view.render(data)

      expect(handlesContainer.render).to.have.been.called
      expect(range.render).to.have.been.called
      expect(labelsContainer.render).to.have.been.called
      expect(input.render).to.have.been.called
      expect(ruler.render).to.have.been.called
    })
  })

  describe('getTrackWidth/getTrackHeight', () => {
    it('should get track width/height', () => {
      const width = view.getTrackWidth()
      const height = view.getTrackHeight()

      expect(width).to.equal(10)
      expect(height).to.equal(10)
    })
  })

  describe('toggleLabels', () => {
    it('should toggle labels visibility', () => {
      if (labelsContainer.element instanceof MockElement) {
        view.toggleLabels(true)

        expect(labelsContainer.element.isShown).to.equal(true)

        view.toggleLabels(false)

        expect(labelsContainer.element.isShown).to.equal(false)
      }
    })
  })

  describe('toggleRuler', () => {
    it('should toggle ruler visibility', () => {
      if (ruler.element instanceof MockElement) {
        view.toggleRuler(true)

        expect(ruler.element.isShown).to.equal(true)

        view.toggleRuler(false)

        expect(ruler.element.isShown).to.equal(false)
      }
    })
  })
})
