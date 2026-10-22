// Typed models for the OpenlibraryAuthors SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Author {
  key?: string
  name?: string
  top_work?: string
  work_count?: number
}

export interface AuthorListMatch {
  q: string
}

export interface AuthorId {
  bio?: any
  birth_date?: string
  key?: string
  name?: string
}

export interface AuthorIdLoadMatch {
  author_id: string
}

export interface AuthorWork {
  id?: string
  key?: string
  title?: string
}

export interface AuthorWorkListMatch {
  id: string
  limit?: number
  offset?: number
}

