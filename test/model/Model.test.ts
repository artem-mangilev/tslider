import { expect } from 'chai'
import 'mocha'
import Model from '../../src/model/Model'
import ModelDependencyBuilder from '../../src/model/ModelDependencyBuilder'
import ModelParams from '../../src/model/ModelParams'

describe(Model.name, () => {
  let model: Model

  beforeEach(() => {
    const params: ModelParams = {
      min: 0,
      max: 10,
      step: 1,
      rulerSteps: 5,
      values: [2, 3],
      trackWidth: 100,
      trackHeight: 10,
      inputValuesSeparator: ',',
    }
    const builder = new ModelDependencyBuilder(params)
    model = new Model(builder.build())
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
})

// describe('Model', () => {
//   describe('updateHandlesByValues in pick single value mode', () => {
//     let model: Model

//     beforeEach(() => {
//       model = new Model({
//         min: 0,
//         max: 10,
//         step: 1,
//         rulerSteps: 1,
//         values: [5],
//         trackWidth: 100,
//         trackHeight: 10,
//         inputValuesSeparator: '-'
//       })
//     })

//     it('should set 1st handle position if one value passed', () => {
//       model.updateHandlesByValues([6])

//       expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
//     })

//     it('should ignore the values after first one', () => {
//       model.updateHandlesByValues([6, 7])

//       expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
//       expect(model.handlePositions[1]).to.be.undefined
//     })
//   })

//   describe('updateHandlesByValues in range mode', () => {
//     let model: Model

//     beforeEach(() => {
//       model = new Model({
//         min: 0,
//         max: 10,
//         step: 1,
//         rulerSteps: 1,
//         values: [5, 9],
//         trackWidth: 100,
//         trackHeight: 10,
//         inputValuesSeparator: '-'
//       })
//     })

//     it('should set 1st handle position if one value passed', () => {
//       model.updateHandlesByValues([6])

//       expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
//       expect(model.handlePositions[1]).to.eql({ x: 90, y: 5 })
//     })

//     it('should set both handle positions if two values passed', () => {
//       model.updateHandlesByValues([6, 7])

//       expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
//       expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
//     })

//     it('should ignore values after second one', () => {
//       model.updateHandlesByValues([6, 7, 8])

//       expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
//       expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
//       expect(model.handlePositions[2]).to.be.undefined
//     })
//   })

//   describe('updateHandle', () => {
//     let model: Model

//     beforeEach(() => {
//       model = new Model({
//         min: 0,
//         max: 10,
//         step: 1,
//         rulerSteps: 1,
//         values: [5, 7],
//         trackWidth: 100,
//         trackHeight: 10,
//         inputValuesSeparator: '-'
//       })
//     })

//     it('should set handle with smallest position (from two) to new position', () => {
//       model.updateHandle(57)

//       expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
//       expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
//     })

//     it('should set handle with biggest position (from two) to new position', () => {
//       model.updateHandle(63)

//       expect(model.handlePositions[0]).to.eql({ x: 50, y: 5 })
//       expect(model.handlePositions[1]).to.eql({ x: 60, y: 5 })
//     })
//   })

//   describe('updateHandleByIndex', () => {
//     let model: Model

//     beforeEach(() => {
//       model = new Model({
//         min: 0,
//         max: 10,
//         step: 1,
//         rulerSteps: 1,
//         values: [5, 7],
//         trackWidth: 100,
//         trackHeight: 10,
//         inputValuesSeparator: '-'
//       })
//     })

//     it('should set handle with specifit index to new position', () => {
//       model.updateHandleByIndex(63, 0)

//       expect(model.handlePositions[0]).to.eql({ x: 60, y: 5 })
//       expect(model.handlePositions[1]).to.eql({ x: 70, y: 5 })
//     })

//     it('should ignore invalid indexes', () => {
//       model.updateHandleByIndex(63, 5)

//       expect(model.handlePositions[5]).to.be.undefined
//     })
//   })

//   describe('resize', () => {
//     let model: Model

//     beforeEach(() => {
//       model = new Model({
//         min: 0,
//         max: 10,
//         step: 1,
//         rulerSteps: 1,
//         values: [5, 7],
//         trackWidth: 100,
//         trackHeight: 10,
//         inputValuesSeparator: '-'
//       })
//     })

//     it('should recalculate handle positions according to new track length', () => {
//       model.resize(200)

//       expect(model.handlePositions[0]).to.eql({ x: 100, y: 5 })
//       expect(model.handlePositions[1]).to.eql({ x: 140, y: 5 })
//     })
//   })
// })
