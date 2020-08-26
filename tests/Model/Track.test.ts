import { expect } from 'chai'
import 'mocha'
import Track from '../../src/model/Track'
import Handle from '../../src/model/Handle'

describe('Track', () => {
  describe('validatePoint', () => {
    let steps, length, firstHandle: Handle, lastHandle: Handle, track: Track

    beforeEach(() => {
      steps = 10
      length = 100
      firstHandle = new Handle(10)
      lastHandle = new Handle(30)
      track = new Track(steps, length, [firstHandle, lastHandle])
    })

    it('should return a higher valid point', () => {
      const pointThatCloseToHigherValidPoint = 18
      const point = track.validatePoint(pointThatCloseToHigherValidPoint)

      const validPoint = 20
      expect(point).to.equal(validPoint)
    })

    it('should return a higher valid point if input point is in the middle', () => {
      const pointThatCloseToHigherValidPoint = 15
      const point = track.validatePoint(pointThatCloseToHigherValidPoint)

      const validPoint = 20
      expect(point).to.equal(validPoint)
    })

    it('should return a lower valid point', () => {
      const pointThatCloseToLowerValidPoint = 13
      const point = track.validatePoint(pointThatCloseToLowerValidPoint)

      const validPoint = 10
      expect(point).to.equal(validPoint)
    })

    it('should return 0 if point is lower than 0', () => {
      const point = track.validatePoint(-5)

      const validPoint = 0
      expect(point).to.equal(validPoint)
    })

    it('should return track length if point is higher than length', () => {
      const point = track.validatePoint(track.length + 10)

      const validPoint = track.length
      expect(point).to.equal(validPoint)
    })

    it('should return a point that equal to first handle position if last handle is active and number that lower than first handle position is passed', () => {
      track.setActiveHandle(lastHandle)

      const point = track.validatePoint(5)

      expect(point).to.equal(firstHandle.position)
    })

    it('should return a point that equal to last handle position if first handle is active and number that greater than last handle position is passed', () => {
      track.setActiveHandle(firstHandle)

      const point = track.validatePoint(35)

      expect(point).to.equal(lastHandle.position)
    })
  })

  describe('getNearestPointIndex', () => {
    let steps: number,
      length: number,
      firstHandle: Handle,
      lastHandle: Handle,
      handles: Handle[],
      track: Track

    beforeEach(() => {
      steps = 10
      length = 100
      firstHandle = new Handle(10)
      lastHandle = new Handle(30)
      handles = [firstHandle, lastHandle]

      track = new Track(steps, length, handles)
    })

    it('should return index of first handle if input point is closer to it than to the second handle', () => {
      const index = track.getNearestPointIndex(13)

      expect(handles[index]).to.equal(firstHandle)
    })

    it('should return index of last handle if input point is closer to it than to the first handle', () => {
      const index = track.getNearestPointIndex(25)

      expect(handles[index]).to.equal(lastHandle)
    })

    it('should return index of single handle if there is one handle', () => {
      handles = [new Handle(10)]
      track = new Track(steps, length, handles)

      const index = track.getNearestPointIndex(50)


      expect(handles[index]).to.equal(handles[0])
    })
  })
})
