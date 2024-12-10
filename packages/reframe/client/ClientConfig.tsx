import "@double-observer/react-client/flight"

import type {
  ClientRefKey,
  ReactFlightClientConfig,
  ReactReference$$id,
} from "@double-observer/react-client/src/ReactFlightClientConfig"
import { ComponentType } from "react"

type AnyFunction = (...args: any[]) => any
type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type ModuleMap = Record<string, Record<string, ComponentType>>

type Config = Prettify<
  Omit<Partial<ReactFlightClientConfig>, "rendererPackageName" | "rendererVersion"> &
    Pick<ReactFlightClientConfig, "rendererPackageName" | "rendererVersion">
>

export function createClientConfig<C extends Config>(props: {
  modules: ModuleMap
  debug?: typeof console.debug | null
  config: C
}): Readonly<ReactFlightClientConfig & C> {
  const decoderOptions = { stream: true }

  return {
    dispatchHint(code: any, model: any) {
      props.debug?.("dispatchHint", { code, model })
    },

    createStringDecoder: () => new TextDecoder(),

    readPartialStringChunk: (decoder, buffer) => decoder.decode(buffer, decoderOptions),

    readFinalStringChunk: (decoder, buffer) => decoder.decode(buffer),

    preloadModule<T>(clientReference: ClientRefKey) {
      props.debug?.("preloadModule", { clientReference })
      return null
    },

    requireModule<T>(clientReference: ClientRefKey): T {
      props.debug?.("requireModule", { clientReference })
      try {
        const [id, name] = clientReference.split("#") as [
          keyof ModuleMap,
          keyof ModuleMap[keyof ModuleMap],
        ]
        return props.modules[id][name] as T
      } catch (error) {
        console.warn("requireModule error", { clientReference, error })
        return props.modules.ReFrameDynamic.MissingView as T
      }
    },

    resolveClientReference(bundlerConfig, [moduleId, chunks, name]) {
      props.debug?.("resolveClientReference", { bundlerConfig, moduleId, chunks, name })
      if (moduleId in props.modules) {
        const selectedModule = props.modules[moduleId]
        if (name in selectedModule) {
          return `${moduleId}#${name}` as ReactReference$$id
        }
      }
      console.warn("resolveClientReference", "ref not found", { moduleId, chunks, name })
      return `ReFrameDynamic#MissingView`
    },

    resolveServerReference(bundlerConfig, id) {
      props.debug?.("resolveServerReference", { bundlerConfig, id })
      throw new Error("resolveServerReference not implemented.")
    },

    prepareDestinationForModule(moduleLoading, nonce, metadata) {
      console.warn("prepareDestinationForModule", { moduleLoading, nonce, metadata })
    },

    bindToConsole(methodName, args, env) {
      args = env.toLowerCase() === "server" ? [`[${env}]`, ...args] : args
      const consoleMethod = console[methodName as keyof typeof console]
      if (typeof consoleMethod === "function") {
        return (consoleMethod as AnyFunction).bind(console, ...args)
      }
      return console.log.bind(console, ...args)
    },

    ...props.config,
  } satisfies Readonly<ReactFlightClientConfig & C>
}
