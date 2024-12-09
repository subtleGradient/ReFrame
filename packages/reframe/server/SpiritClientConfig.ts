import { ComponentType } from "react"
import "@double-observer/react-client"
import type {
  ClientReference,
  ReactFlightClientConfig,
  ReactReference$$id,
} from "react-client/src/ReactFlightClientConfig"

export const ReFrameDynamic: Record<string, ClientReference<ComponentType>["__T"]> = {}

const modules = {
  ReFrameDynamic,
}

const isDebugLoggingEnabled = false

const debug = isDebugLoggingEnabled ? console.debug : null

const decoderOptions = { stream: true }

const ReFrameReactFlightClientConfig: ReactFlightClientConfig = {
  rendererPackageName: "@double-observer/reframe",
  rendererVersion: "2024.12.9",

  dispatchHint(code, model) {
    debug?.("dispatchHint", { code, model })
  },

  createStringDecoder: () => new TextDecoder(),
  readPartialStringChunk: (decoder, buffer) => decoder.decode(buffer, decoderOptions),
  readFinalStringChunk(decoder, buffer) {
    // debug?.("readFinalStringChunk", { decoder, buffer })
    return decoder.decode(buffer)
  },

  preloadModule<T>(clientReference: ClientReference<T>) {
    debug?.("preloadModule", { clientReference })
    // throw new Error("Function not implemented.")
    return null
  },
  requireModule<T>(clientReference: ClientReference<T>): T {
    debug?.("requireModule", { clientReference })
    try {
      const [id, name] = clientReference.split("#") as [
        keyof typeof modules,
        keyof (typeof modules)[keyof typeof modules],
      ]
      return modules[id][name] as T
    } catch (error) {
      console.warn("requireModule error", { clientReference, error })
      return modules.ReFrameDynamic.MissingView as T
    }
  },

  resolveClientReference(bundlerConfig, [moduleId, chunks, name]) {
    debug?.("resolveClientReference", { bundlerConfig, moduleId, chunks, name })
    if (moduleId in modules) {
      const selectedModule = modules[moduleId as keyof typeof modules]
      if (name in selectedModule) {
        return `${moduleId}#${name}` as ReactReference$$id
      }
    }
    console.warn("resolveClientReference", "ref not found", { moduleId, chunks, name })
    return `ReFrameMicro#MissingView`
  },
  resolveServerReference(bundlerConfig, id) {
    debug?.("resolveServerReference", { bundlerConfig, id })
    throw new Error("resolveServerReference not implemented.")
  },
  prepareDestinationForModule(moduleLoading, nonce, metadata) {
    debug?.("prepareDestinationForModule", { moduleLoading, nonce, metadata })
  },
  bindToConsole(methodName, args, env): () => void {
    args = env.toLowerCase() === "server" ? [`[${env}]`, ...args] : args
    const consoleMethod = console[methodName as keyof typeof console]
    if (typeof consoleMethod === "function") {
      return (consoleMethod as AnyFunction).bind(console, ...args)
    }
    return console.log.bind(console, ...args)
  },
}

type AnyFunction = (...args: any[]) => any

export default ReFrameReactFlightClientConfig
