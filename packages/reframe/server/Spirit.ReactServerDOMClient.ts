/* eslint-disable @typescript-eslint/no-explicit-any */

import ReactFlightClient, { FindSourceMapURLCallback, FlightResponse } from "react-client/flight"
import type {
  ModuleLoading,
  ServerManifest,
  SSRModuleMap,
} from "react-client/src/ReactFlightClientConfig"
import {
  CallServerCallback,
  EncodeFormActionCallback,
} from "react-client/src/ReactFlightReplyClient"
import { TemporaryReferenceSet } from "react-client/src/ReactFlightTemporaryReferences"
import type { Thenable } from "shared/ReactTypes"
import ReFrameReactFlightClientConfig, { ReFrameDynamic } from "./SpiritClientConfig"
import invariant from "invariant"

export const name = ReFrameReactFlightClientConfig.rendererPackageName
export const version = ReFrameReactFlightClientConfig.rendererVersion
const flight = ReactFlightClient(ReFrameReactFlightClientConfig)

interface FlightResponseProps {
  bundlerConfig: SSRModuleMap | null
  serverReferenceConfig: ServerManifest | null
  moduleLoading: ModuleLoading
  callServer?: CallServerCallback | void
  encodeFormAction?: EncodeFormActionCallback | void
  nonce?: string | void
  temporaryReferences?: TemporaryReferenceSet | void
  findSourceMapURL?: FindSourceMapURLCallback | void
  replayConsole?: boolean
  environmentName?: string
}

function createFlightResponse() {
  const props: FlightResponseProps = {
    bundlerConfig: null,
    serverReferenceConfig: null,
    moduleLoading: {
      status: "loaded",
      load(url, nonce, _onload, _onerror) {
        console.warn(
          "reframe/react-client-spirit/Spirit.ReactServerDOMClient.ts createFlightResponse moduleLoading.load called unexpectedly",
          "url",
          url,
          "nonce",
          nonce,
        )
      },
    },
  }

  if (__DEV__) flight.injectIntoDevTools()

  return flight.createResponse(
    props.bundlerConfig,
    props.serverReferenceConfig,
    props.moduleLoading,
    props.callServer,
    props.encodeFormAction,
    props.nonce,
    props.temporaryReferences,
    props.findSourceMapURL,
    props.replayConsole,
    props.environmentName,
  )
}

export function setDynamicClientModuleExport(key: string, value: (typeof ReFrameDynamic)[string]) {
  ReFrameDynamic[key] = value
}

function replacer(this: any, key: string, value: any) {
  if (key === "children")
    if (value instanceof Promise)
      throw new Error(`Promise values are not supported yet. Got promise for ${key}`)
  if (typeof value === "function")
    throw new Error(`function values are not supported yet. Got function for ${key}`)
  return value
}

// like String.raw, but JSON.stringify the values
const stringified = (strings: TemplateStringsArray, ...valueSubstitutions: any[]) =>
  strings.reduce(
    (output, stringPart, index) =>
      output +
      stringPart +
      (index in valueSubstitutions ? JSON.stringify(valueSubstitutions[index], replacer) : ""),
    "",
  )

export function renderDynamicClientModuleToString(
  element: React.ReactElement & { type: { name: string; displayName?: string } },
) {
  // @ ts-expect-error no need to type this perfectly
  if (element.props?.children?.length > 0)
    throw new Error("children not supported in renderDynamicClientModuleToString yet")
  const name = element.type.displayName ?? element.type.name ?? element.type
  return stringified`1:I["ReFrameDynamic",[],${name}]\n0:["$","$L1",${element.key},${element.props},null]\n`
}

type ChunkValue = Uint8Array | string
type ReadableResult = IteratorResult<ChunkValue, void | null>
type Read = () => Promise<ReadableResult>
type Readable = { read: Read } | { next: Read }

function startReading(response: FlightResponse, reader: Readable, handlers?: SpiritEvents): void {
  invariant(reader && typeof reader === "object", "startReading: reader is required")
  const readNext = (reader as any).read ?? (reader as any).next
  invariant(typeof readNext === "function", "startReading: reader must have a read or next method")
  const pull = readNext.bind(reader)

  function onNext({ done, value: chunk }: ReadableResult): void | Promise<void> {
    if (done) {
      flight.close(response)
      handlers?.onClose?.()
      return
    }
    if (typeof chunk === "string") {
      flight.processStringChunk(response, chunk)
    } else {
      flight.processBinaryChunk(response, chunk)
    }
    return pull().then(onNext).catch(onError)
  }
  function onError(e: any) {
    flight.reportGlobalError(response, e)
  }
  pull().then(onNext).catch(onError)
}

interface SpiritEvents {
  onClose?(): void
}

export function from<T>(
  rsc:
    | ChunkValue
    | Readable
    | Iterable<ChunkValue>
    | AsyncIterator<ChunkValue>
    | AsyncIterable<ChunkValue>
    | AsyncGenerator<ChunkValue>,
  handlers?: SpiritEvents,
): Promise<T> {
  if (typeof rsc === "string" || rsc instanceof Uint8Array) return createFromValue<T>(rsc, handlers)

  invariant(rsc && typeof rsc === "object", "from: reader is required")

  if (Symbol.iterator in rsc) return createFromIterable<T>(rsc, handlers)
  if (Symbol.asyncIterator in rsc)
    return createFromAsyncIterable<T>(rsc[Symbol.asyncIterator](), handlers)
  if ("next" in rsc) return createFromAsyncIterable<T>(rsc, handlers)
  if ("read" in rsc) return createFromAsyncIterable<T>(rsc, handlers)

  const reason =
    "from: reader must be a string, Uint8Array, or some kind of iterable of strings or Uint8Arrays"
  invariant(!(rsc satisfies never), reason)
  throw new TypeError(reason)
}

export function createFromAsyncIterable<T>(reader: Readable, handlers?: SpiritEvents) {
  const response = createFlightResponse()
  try {
    startReading(response, reader, handlers)
  } catch (error) {
    // if (error && ('message' in error) && error.message === "Connection closed.") {}
    console.error("createFromAsyncIterable error", error)
    flight.reportGlobalError(response, error as any)
  }
  const root = flight.getRoot<T>(response)
  return Promise_fromThenable(root)
}

export function createFromIterable<T>(source: Iterable<ChunkValue>, handlers?: SpiritEvents) {
  const response = createFlightResponse()
  for (const chunk of source) {
    if (typeof chunk === "string") flight.processStringChunk(response, chunk)
    else flight.processBinaryChunk(response, chunk)
  }
  flight.close(response)
  handlers?.onClose?.()
  const root = flight.getRoot<T>(response)
  return Promise_fromThenable(root)
}

export function createFromValue<T>(source: ChunkValue, handlers?: SpiritEvents): Promise<T> {
  const response = createFlightResponse()
  if (typeof source === "string") flight.processStringChunk(response, source)
  else flight.processBinaryChunk(response, source)
  flight.close(response)
  handlers?.onClose?.()
  const root = flight.getRoot<T>(response)
  return Promise_fromThenable(root)
}

function Promise_fromThenable<T>(thenable: Thenable<T>): Promise<T> {
  // if it's already a regular promise, return it
  if (thenable instanceof Promise) return thenable

  // if its promise property is a regular promise, return that
  if ("promise" in thenable && thenable.promise instanceof Promise) return thenable.promise

  // otherwise, wrap it in a regular promise
  return ((thenable as any).promise = new Promise<T>((resolve, reject) =>
    thenable.then(resolve, reject),
  ))
}
