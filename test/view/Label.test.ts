import { expect } from 'chai'
import 'mocha'
import { JSDOM } from 'jsdom'
import Label from '../../src/view/Label'
const { window } = new JSDOM('')

const $ = require('jquery')(window)

global.$ = $

describe('Label', () => {})
