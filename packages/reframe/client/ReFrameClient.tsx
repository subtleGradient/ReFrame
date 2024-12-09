import invariant from "invariant"
import ReactFlightClient from "react-client/flight"
import type { ReactFlightClientConfig } from "react-client/src/ReactFlightClientConfig"
import { ChunkSource$forEach } from "../random/ChunkSource$forEach"
import { ChunkSource, IReactFlightClient } from "../random/types"
import { createFlightResponse } from "./createFlightResponse"
import { Promise_fromThenable } from "./Promise_fromThenable"

interface FromProps {
  onClose?(): void
  onError?(error: Error): false | void
}

export class ReFrameClient {
  constructor(public readonly config: ReactFlightClientConfig) {
    this.flight = ReactFlightClient(this.config)
  }

  private readonly flight: IReactFlightClient
  get name() { return this.config.rendererPackageName } // prettier-ignore
  get version() { return this.config.rendererVersion } // prettier-ignore

  from<T>(rsc: ChunkSource, props?: FromProps): Promise<T> {
    const response = createFlightResponse(this.flight, {
      bundlerConfig: null,
      serverReferenceConfig: null,
      moduleLoading: {
        status: "loaded",
        load(url, nonce, _onload, _onerror) {
          console.warn("moduleLoading.load called unexpectedly", "url", url, "nonce", nonce)
        },
      },
    })

    void ChunkSource$forEach(rsc, (chunk) => {
      if (typeof chunk === "string") {
        this.flight.processStringChunk(response, chunk)
      } else {
        this.flight.processBinaryChunk(response, chunk)
      }
    })
      .catch((error) => {
        const ignore = props?.onError?.(error)
        console.error("from error", error)
        this.flight.reportGlobalError(response, error)
      })
      .finally(() => {
        this.flight.close(response)
        props?.onClose?.()
      })

    const root = this.flight.getRoot<T>(response)
    return Promise_fromThenable(root)
  }
}
