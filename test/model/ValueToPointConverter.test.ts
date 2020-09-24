import { expect } from 'chai'
import 'mocha'
import { ValuesStoreGetters } from '../../src/model/ValuesStore'
import ValueToPointConverter from '../../src/model/ValueToPointConverter'
import Shape from '../../src/utils/Shape'

describe(ValueToPointConverter.name, () => {
  describe('convert', () => {
    it('should convert value to point', () => {
      const values: ValuesStoreGetters = {
        getMax: () => 20,
        getMin: () => 10,
        getStep: () => 2,
      }
      const shape: Shape = { width: 100, height: 10 }
      const converter = new ValueToPointConverter(values, shape)

      const data = [
        { in: 10, out: 0 },
        { in: 15, out: 50 },
        { in: 20, out: 100 },
      ]

      data.forEach((piece) =>
        expect(converter.convert(piece.in)).to.equal(piece.out)
      )
    })
  })
})
