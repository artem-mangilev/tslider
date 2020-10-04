import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.should()
chai.use(sinonChai)
const { expect } = chai

import LabelsContainer from '../../src/components/LabelsContainer'
import ViewComponent from '../../src/io/dom/ViewComponent'
import {
  MockCollisionDetector,
  MockElement,
  MockPermitter,
} from './MockClasses'

describe(LabelsContainer.name, () => {
  let container: LabelsContainer,
    element: MockElement,
    cd: MockCollisionDetector,
    labels: ViewComponent[],
    tempLabel: ViewComponent

  beforeEach(() => {
    element = new MockElement()
    cd = new MockCollisionDetector()
    tempLabel = {
      element: new MockElement(),
      render() {
        return
      },
    }
    labels = [
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
    container = new LabelsContainer(
      element,
      new MockPermitter(),
      cd,
      tempLabel,
      labels
    )
  })

  describe('constructor', () => {
    it('should put temporary label and labels to element of this component', () => {
      expect(element.childs.length).to.equal(3)
    })
  })

  describe('render', () => {
    it('should render labels', () => {
      sinon.spy(labels[0], 'render')
      sinon.spy(labels[1], 'render')

      container.render({
        labels: [
          { position: 0, value: '' },
          { position: 0, value: '' },
        ],
        rangeMiddle: 0,
      })

      expect(labels[0].render).to.have.been.called
      expect(labels[1].render).to.have.been.called
    })

    it('should render temorary label if labels collided', () => {
      sinon.spy(tempLabel, 'render')

      cd.setCollisionState(true)

      container.render({
        labels: [
          { position: 0, value: '' },
          { position: 0, value: '' },
        ],
        rangeMiddle: 0,
      })

      expect(tempLabel.render).to.have.been.called
    })
  })
})
