import { expect } from 'chai'
import 'mocha'
import ValuesToTrackPointConverter from '../../src/model/ValuesToTrackPointConverter'
import Ruler from '../../src/model/Ruler'
import Shape from '../../src/utils/Shape'

describe('Ruler', () => {
  describe('getSegments', () => {
    it('should return array of ruler segments', () => {
      const track: Shape = { width: 100, height: 10 }
      const converter = new ValuesToTrackPointConverter(5, 10, 1)
      const ruler = new Ruler(track, converter)

      const segments = ruler.getSegments(2)

      expect(segments[0]).to.eql({ point: 0, value: 5 })
      expect(segments[1]).to.eql({ point: 50, value: 7.5 })
      expect(segments[2]).to.eql({ point: 100, value: 10 })
    })
  })
})
