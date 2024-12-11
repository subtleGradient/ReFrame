import { ReactNode, Thenable } from "./ReactTypes"

/** unique id for a loadable module like a {@link ChunkId} */
type ModuleID = (number | string) & { __moduleId__?: void }

/** name of something exported from a client module */
type ClientModuleExportName = string & { __ClientModuleExportName__?: void }

/** $$id attribute of a Client Reference or Server Reference */
export type ReactReference$$id = `${ModuleID}#${ClientModuleExportName}`

export type ClientReferenceKey = ReactReference$$id

export type FlightRequest = unknown

export type ClientReference<T> = T & {
  $$typeof: Symbol | number
  $$id: string
  $$async: boolean
  /** in development this is the full module object, or at least the function that is exported from it */
  value?: T
}

export type ServerReference<T> = {
  $$typeof: Symbol | number
  $$id: string
  $$bound: null | Thenable<Array<any>>
  /** For functions, its name. Optional */
  name?: string
  /** DEV-only for stack traces */
  location?: string
  /** DEV-only for environment name */
  env?: string
}

export type ClientManifest = {
  [id: string]: ClientReferenceMetadata
}

export type ClientReferenceMetadata = {
  id: string
  chunks: Array<string>
  name: string
  async: boolean
}

export type ServerReferenceId = string

export type Options = {
  identifierPrefix?: string
  signal?: AbortSignal
  onError?: (error: Error) => void
  onPostpone?: (reason: string) => void
  onHeaders?: (headers: Headers) => void
  maxHeadersLength?: number
  nonce?: string
  bootstrapScriptContent?: string
  importMap?: { imports: { [key: string]: unknown } }
  moduleLoading?: {
    prefix: string
    crossOrigin?: "" | "use-credentials" | undefined
    integrity?: string
  }
  progressiveChunkSize?: number
  resumableStateFormat?: "binary" | "json"
}

export type PreloadOptions = {
  as: "script" | "style" | "font"
  crossOrigin?: "" | "use-credentials"
  integrity?: string
}

export type PreinitOptions = {
  as: "script" | "style" | "font"
  crossOrigin?: "" | "use-credentials"
  integrity?: string
}

export type PreloadableEntry =
  | {
      href: string
      rel: "preload"
      as: string
      crossOrigin?: "" | "use-credentials"
      integrity?: string
      type?: string
    }
  | {
      href: string
      rel: "modulepreload"
      as: "script"
      crossOrigin?: "" | "use-credentials"
      integrity?: string
    }

export type PreinitedEntry =
  | {
      href: string
      rel: "stylesheet"
      as: "style"
      crossOrigin?: "" | "use-credentials"
      integrity?: string
    }
  | {
      src: string
      rel: "preinit"
      as: "script"
      crossOrigin?: "" | "use-credentials"
      integrity?: string
    }

export type PreloadSet = Set<PreloadableEntry>

export interface Result {
  preloads: PreloadSet
  preloadedModules: Set<Promise<unknown> | any>
  preinits: Array<PreinitedEntry>
  model: string
  chunks: Array<string | Uint8Array>
  postponed?: any

  // This API is only called during the render phase, and doesn't deal with
  // side effects. Thus it doesn't need any special treatment.
  getPreloadUrls(): Array<string>

  pipe(destination: WritableStream): void
  resume(): Promise<Result>
}

export type ServerContextJSONValue =
  | string
  | boolean
  | number
  | null
  | readonly ServerContextJSONValue[]
  | { readonly [key: string]: ServerContextJSONValue }

export type ServerContext<T = any> = {
  Provider: (props: { value: T; children: ReactNode }) => ReactNode
  $$typeof: symbol | number
  _currentValue: T
  _currentValue2: T
  _threadCount: number
  _defaultValue: T
  _globalName: string
}
