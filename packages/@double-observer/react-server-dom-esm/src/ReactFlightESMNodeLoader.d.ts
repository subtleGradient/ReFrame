// packages/react-server-dom-esm/src/ReactFlightESMNodeLoader.d.ts
type ResolveContext = {
  conditions: Array<string>
  parentURL: string | void
}

type ResolveFunction = (string, ResolveContext, ResolveFunction) => { url: string } | Promise<{ url: string }>

type GetSourceContext = {
  format: string
}

type GetSourceFunction = (string, GetSourceContext, GetSourceFunction) => Promise<{ source: Source }>

type TransformSourceContext = {
  format: string
  url: string
}

type TransformSourceFunction = (Source, TransformSourceContext, TransformSourceFunction) => Promise<{ source: Source }>

type LoadContext = {
  conditions: Array<string>
  format: string | null | void
  importAssertions: Object
}

type LoadFunction = (
  string,
  LoadContext,
  LoadFunction,
) => Promise<{ format: string; shortCircuit?: boolean; source: Source }>

type Source = string | ArrayBuffer | Uint8Array

export declare const resolve: ResolveFunction
export declare const getSource: GetSourceFunction
export declare const load: LoadFunction
export declare const transformSource: TransformSourceFunction
