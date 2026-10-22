
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { OpenlibraryAuthorsSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = OpenlibraryAuthorsSDK.test()
    equal(testsdk instanceof OpenlibraryAuthorsSDK, true,
      'OpenlibraryAuthorsSDK.test() must return a client synchronously')
  })

})
