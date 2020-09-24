import { expect } from 'chai'
import 'mocha'
import ValuesStore from '../../src/model/ValuesStore'

describe(ValuesStore.name, () => {
  describe('constructor', () => {
    it('should set min, max, and step', () => {
      const store = new ValuesStore(0, 10, 1)

      const min = store.getMin()
      const max = store.getMax()
      const step = store.getStep()

      expect(min).to.equal(0)
      expect(max).to.equal(10)
      expect(step).to.equal(1)
    })

    it('should thrown an error if min, max or step is invalid', () => {
      expect(() => new ValuesStore(100, 10, 1)).to.throw()
      expect(() => new ValuesStore(0, 10, 100)).to.throw()
    })
  })

  describe('setMin/getMin', () => {
    it('should set new min and get it', () => {
      const store = new ValuesStore(0, 10, 1)

      store.setMin(5)

      expect(store.getMin()).to.equal(5)
    })

    it('should not set new min if provided arg is invalid', () => {
      const store = new ValuesStore(0, 10, 1)

      store.setMin(15)

      expect(store.getMin()).to.equal(0)
    })
  })

  describe('setMax/getMax', () => {
    it('should set new max and get it', () => {
      const store = new ValuesStore(0, 10, 1)

      store.setMax(8)

      expect(store.getMax()).to.equal(8)
    })

    it('should not set new max if provided arg is invalid', () => {
      const store = new ValuesStore(0, 10, 1)

      store.setMax(-100)

      expect(store.getMax()).to.equal(10)
    })
  })

  describe('setStep/getStep', () => {
    it('should set new step and get it', () => {
      const store = new ValuesStore(0, 10, 1)

      store.setStep(2)

      expect(store.getStep()).to.equal(2)
    })

    it('should not set new step if provided arg is invalid', () => {
      const store = new ValuesStore(0, 10, 1)

      store.setStep(100)

      expect(store.getStep()).to.equal(1)
    })
  })
})
