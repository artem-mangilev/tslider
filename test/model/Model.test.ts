import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.should()
chai.use(sinonChai)
const { expect } = chai

import Model from '../../src/model/Model'
import ModelBuilder from '../../src/model/ModelBuilder'
import ModelParams from '../../src/model/ModelParams'

describe(Model.name, () => {
  let model: Model

  beforeEach(() => {
    const params: ModelParams = {
      min: 0,
      max: 10,
      step: 1,
      rulerSteps: 2,
      values: [2, 3],
      trackWidth: 100,
      trackHeight: 10,
      inputValuesSeparator: ',',
    }
    model = new ModelBuilder(params).build()
  })

  describe('setMinValue/getMinValue', () => {
    it('should set min value and get it', () => {
      model.setMinValue(2)

      expect(model.getMinValue()).to.equal('2')
    })
  })

  describe('setMaxValue/getMaxValue', () => {
    it('should set max value and get it', () => {
      model.setMaxValue(15)

      expect(model.getMaxValue()).to.equal('15')
    })
  })

  describe('setStep/getStep', () => {
    it('should set step and get it', () => {
      model.setStep(5)

      expect(model.getStep()).to.equal('5')
    })
  })

  describe('setFrom/getFrom', () => {
    it('should set from value and get it', () => {
      model.setFrom(1)

      expect(model.getFrom()).to.equal('1')
    })
  })

  describe('setTo/getTo', () => {
    it('should set to value and get it', () => {
      model.setTo(5)

      expect(model.getTo()).to.equal('5')
    })
  })

  describe('setHandle/handles', () => {
    it('should set handle by position and get correct related data', () => {
      model.setHandle(100)

      expect(model.handles[1].position.x).to.equal(100)
      expect(model.handles[1].value).to.equal('10')
    })
  })

  describe('setHandleByIndex/handles', () => {
    it('should set handle by index and get correct related data', () => {
      model.setHandleByIndex(100, 1)

      expect(model.handles[1].position.x).to.equal(100)
      expect(model.handles[1].value).to.equal('10')
    })
  })

  describe('setHandleByValue/handles', () => {
    it('should set handle by index and get correct related data', () => {
      model.setHandleByValue(10)

      expect(model.handles[1].position.x).to.equal(100)
      expect(model.handles[1].value).to.equal('10')
    })
  })

  describe('resize/handles', () => {
    it('should resize the track and get correct related data', () => {
      expect(model.handles[1].position.x).to.equal(30)

      model.resize(200)

      expect(model.handles[1].position.x).to.equal(60)
    })
  })

  describe('filler', () => {
    it('should get filler', () => {
      expect(model.filler.position.x).to.equal(20)
      expect(model.filler.length).to.equal(10)
    })
  })

  describe('ruler', () => {
    it('should get ruler', () => {
      expect(model.ruler).to.eql([
        { point: 0, value: '0' },
        { point: 50, value: '5' },
        { point: 100, value: '10' },
      ])
    })
  })

  describe('inputValue', () => {
    it('should get input value', () => {
      expect(model.inputValue).to.equal('2,3')
    })
  })

  describe('addUpdateHandler', () => {
    it('should set handler which will trigger after updates', () => {
      const callback = sinon.spy()

      model.addUpdateHandler(callback)
      model.setHandleByValue(5)

      expect(callback).to.have.been.calledWith('2,5')
    })
  })
})
