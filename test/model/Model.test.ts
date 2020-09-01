import { expect } from 'chai'
import 'mocha'
import Model from '../../src/model/Model'

describe('Model', () => {
  describe('updateHandlesByValues in pick single value mode', () => {
    let model: Model

    beforeEach(() => {
      model = new Model({
        min: 0,
        max: 10,
        step: 1,
        trackLength: 100,
        rulerSteps: 1,
        values: [5],
        trackWidth: 100,
        trackHeight: 10,
      })
    })

    it('should set 1st handle position if one value passed', () => {
      model.updateHandlesByValues([6])

      expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
    })

    it('should ignore the values after first one', () => {
      model.updateHandlesByValues([6, 7])

      expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
      expect(model.handlePositions[1]).to.be.undefined
    })
  })

  describe('updateHandlesByValues in range mode', () => {
    let model: Model

    beforeEach(() => {
      model = new Model({
        min: 0,
        max: 10,
        step: 1,
        trackLength: 100,
        rulerSteps: 1,
        values: [5, 9],
        trackWidth: 100,
        trackHeight: 10,
      })
    })

    it('should set 1st handle position if one value passed', () => {
      model.updateHandlesByValues([6])

      expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
      expect(model.handlePositions[1]).to.eql({ x: 90, y: 5 })
    })

    it('should set both handle positions if two values passed', () => {
      model.updateHandlesByValues([6, 7])

      expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
      expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
    })

    it('should ignore values after second one', () => {
      model.updateHandlesByValues([6, 7, 8])

      expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
      expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
      expect(model.handlePositions[2]).to.be.undefined
    })
  })

  describe('updateHandle', () => {
    let model: Model

    beforeEach(() => {
      model = new Model({
        min: 0,
        max: 10,
        step: 1,
        trackLength: 100,
        rulerSteps: 1,
        values: [5, 7],
        trackWidth: 100,
        trackHeight: 10,
      })
    })

    it('should set handle with smallest position (from two) to new position', () => {
      model.updateHandle(57)

      expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
      expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
    })

    it('should set handle with biggest position (from two) to new position', () => {
      model.updateHandle(63)

      expect(model.handlePositions[0]).to.eql({ x: 50, y: 5 })
      expect(model.handlePositions[1]).to.eql({ x: 60, y: 5 })
    })
  })

  describe('updateHandleByIndex', () => {
    let model: Model

    beforeEach(() => {
      model = new Model({
        min: 0,
        max: 10,
        step: 1,
        trackLength: 100,
        rulerSteps: 1,
        values: [5, 7],
        trackWidth: 100,
        trackHeight: 10,
      })
    })

    it('should set handle with specifit index to new position', () => {
      model.updateHandleByIndex(63, 0)

      expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
      expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
    })

    it('should ignore invalid indexes', () => {
      model.updateHandleByIndex(63, 5)

      expect(model.handlePositions[5]).to.be.undefined
    })
  })

  describe('resize', () => {
    let model: Model

    beforeEach(() => {
      model = new Model({
        min: 0,
        max: 10,
        step: 1,
        trackLength: 100,
        rulerSteps: 1,
        values: [5, 7],
        trackWidth: 100,
        trackHeight: 10,
      })
    })

    it('should recalculate handle positions according to new track length', () => {
      model.resize(200)

      expect(model.handlePositions[0]).to.eql({ x: 100, y: 5 })
      expect(model.handlePositions[1]).to.eql({ x: 140, y: 5 })
    })
  })
})
