import { expect } from 'chai'
import 'mocha'
import TrackPointValidator from '../../src/model/TrackPointValidator'
import NearPointCalculator from '../../src/model/NearPointCalculator'
import { ValuesStoreGetters } from '../../src/model/ValuesStore'
import Shape from '../../src/utils/Shape'

describe(TrackPointValidator.name, () => {
  describe('validatePoint', () => {
    it('should get valid point', () => {
      const values: ValuesStoreGetters = {
        getMin: () => 10,
        getMax: () => 20,
        getStep: () => 5,
      }
      const track: Shape = {
        width: 100,
        height: 10,
      }
      const validator = new TrackPointValidator(
        values,
        track,
        new NearPointCalculator()
      )

      const data = [
        { in: -10, out: 0 },
        { in: 40, out: 50 },
        { in: 80, out: 100 },
        { in: 150, out: 100 },
      ]

      data.forEach((piece) =>
        expect(validator.validatePoint(piece.in)).to.equal(piece.out)
      )
    })
  })
})
