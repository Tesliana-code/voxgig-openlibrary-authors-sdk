
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'OpenlibraryAuthors',
        slug: "openlibrary-authors",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },

  }


  options = {
    base: "https://openlibrary.org",

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        author: {
        },
  
        author_id: {
        },
  
        author_work: {
        },
  
    }
  }


  entity = {
    "author": {
      "fields": [
        {
          "name": "key",
          "title": "Key",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`"
        },
        {
          "name": "top_work",
          "title": "Top Work",
          "type": "`$STRING`"
        },
        {
          "name": "work_count",
          "title": "Work Count",
          "type": "`$INTEGER`"
        }
      ],
      "name": "author",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/search/authors.json",
              "segments": [
                {
                  "lit": "search"
                },
                {
                  "lit": "authors.json"
                }
              ],
              "parts": [
                "search",
                "authors.json"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.docs`"
              },
              "args": {
                "query": [
                  {
                    "name": "q",
                    "orig": "q",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "q"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "author_id": {
      "fields": [
        {
          "name": "bio",
          "title": "Bio",
          "type": "`$ANY`",
          "short": "May be a string or object; intentionally not overtyped."
        },
        {
          "name": "birth_date",
          "title": "Birth Date",
          "type": "`$STRING`"
        },
        {
          "name": "key",
          "title": "Key",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`"
        }
      ],
      "name": "author_id",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/authors/{authorId}.json",
              "segments": [
                {
                  "lit": "authors"
                },
                {
                  "lit": "{author_id}.json"
                }
              ],
              "parts": [
                "authors",
                "{author_id}.json"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "author_id",
                    "orig": "authorId",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "author_id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "author_work": {
      "fields": [
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`"
        },
        {
          "name": "key",
          "title": "Key",
          "type": "`$STRING`"
        },
        {
          "name": "title",
          "title": "Title",
          "type": "`$STRING`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "author_work",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/authors/{authorId}/works.json",
              "segments": [
                {
                  "lit": "authors"
                },
                {
                  "var": "id"
                },
                {
                  "lit": "works.json"
                }
              ],
              "parts": [
                "authors",
                "{id}",
                "works.json"
              ],
              "rename": {
                "param": {
                  "authorId": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.entries`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "authorId",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ],
                "query": [
                  {
                    "name": "limit",
                    "orig": "limit",
                    "type": "`$INTEGER`",
                    "kind": "query"
                  },
                  {
                    "name": "offset",
                    "orig": "offset",
                    "type": "`$INTEGER`",
                    "kind": "query"
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

