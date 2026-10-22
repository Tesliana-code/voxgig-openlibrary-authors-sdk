import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "author",
    "accessor": "Author",
    "op": "list",
    "method": "GET",
    "path": "/search/authors.json",
    "args": [],
    "select": {
      "q": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "q"
    ],
    "queryArgs": [
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": {
      "numFound": 1,
      "start": 1,
      "docs": [
        {
          "key": "x",
          "name": "x",
          "work_count": 1,
          "top_work": "x"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "author_id",
    "accessor": "AuthorId",
    "op": "load",
    "method": "GET",
    "path": "/authors/{authorId}.json",
    "args": [
      {
        "name": "author_id",
        "wire": "authorId",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "key": "x",
      "name": "x",
      "birth_date": "x"
    },
    "idField": "id"
  },
  {
    "entity": "author_work",
    "accessor": "AuthorWork",
    "op": "list",
    "method": "GET",
    "path": "/authors/{authorId}/works.json",
    "args": [
      {
        "name": "id",
        "wire": "authorId",
        "value": "p1"
      }
    ],
    "select": {
      "limit": "v1",
      "offset": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "limit",
      "offset"
    ],
    "queryArgs": [
      {
        "name": "limit",
        "wire": "limit"
      },
      {
        "name": "offset",
        "wire": "offset"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": {
      "size": 1,
      "links": {},
      "entries": [
        {
          "key": "x",
          "title": "x"
        }
      ]
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
