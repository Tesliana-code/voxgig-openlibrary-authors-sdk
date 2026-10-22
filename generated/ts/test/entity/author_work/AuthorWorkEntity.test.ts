

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { OpenlibraryAuthorsSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('AuthorWorkEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OPENLIBRARY_AUTHORS_TEST_LIVE=TRUE.
  afterEach(liveDelay('OPENLIBRARY_AUTHORS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = OpenlibraryAuthorsSDK.test()
    const ent = testsdk.AuthorWork()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = OpenlibraryAuthorsSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.AuthorWork().list({"id":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OPENLIBRARY_AUTHORS_TEST_LIVE
    for (const op of []) {
      if (!live && maybeSkipControl(t, 'entityOp', 'author_work.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":0},"key":{"a":true,"h":"Key","n":"key","r":false,"t":"`$STRING`","key$":"key","index$":1},"title":{"a":true,"h":"Title","n":"title","r":false,"t":"`$STRING`","key$":"title","index$":2}},"id":{"field":"id","name":"id"},"name":"author_work","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /authors/{authorId}/works.json","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"authorId","r":true,"t":"`$STRING`","index$":0}],"query":[{"a":true,"k":"query","n":"limit","or":"limit","r":false,"t":"`$INTEGER`","index$":0},{"a":true,"k":"query","n":"offset","or":"offset","r":false,"t":"`$INTEGER`","index$":1}]},"k":"http","m":"GET","o":"/authors/{authorId}/works.json","q":{"exist":["id"]},"r":{"param":{"authorId":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"authors"},{"var":"id"},{"lit":"works.json"}],"t":{"req":"`reqdata`","res":"`body.entries`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"author_work","name__orig":"author_work","Name":"AuthorWork","name_":"author_work","name-":"author-work","NAME":"AUTHOR_WORK","index$":2}, {"active":true,"entity":"author_work","key$":"BasicAuthorWorkFlow","kind":"basic","name":"BasicAuthorWorkFlow","param":{},"step":[{"a":false,"d":{},"i":{},"m":{"author_id":"author01"},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"author_work_ref01"}}],"unreachable":true}]}, 'AuthorWork', {"GET /authors/{authorId}/works.json":{"protocol":"http","parameters":[{"name":"authorId","in":"path","required":true,"schema":{"type":"string"},"index$":0},{"name":"limit","in":"query","schema":{"type":"integer","minimum":1},"index$":1},{"name":"offset","in":"query","schema":{"type":"integer","minimum":0},"index$":2}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let author_work_ref01_data = Object.values(setup.data.existing.author_work)[0] as any

  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/author_work/AuthorWorkTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = OpenlibraryAuthorsSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['author_work01','author_work02','author_work03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OPENLIBRARY_AUTHORS_TEST_AUTHOR_WORK_ENTID': idmap,
    'OPENLIBRARY_AUTHORS_TEST_LIVE': 'FALSE',
    'OPENLIBRARY_AUTHORS_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['OPENLIBRARY_AUTHORS_TEST_AUTHOR_WORK_ENTID']

  const live = 'TRUE' === env.OPENLIBRARY_AUTHORS_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OPENLIBRARY_AUTHORS_TEST_AUTHOR_WORK_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new OpenlibraryAuthorsSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.OPENLIBRARY_AUTHORS_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
