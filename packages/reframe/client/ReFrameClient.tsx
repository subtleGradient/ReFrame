import ReactFlightClient from "@double-observer/react-client/flight"
import { ReactFlightClientConfig } from "@double-observer/react-client/src/ReactFlightClientConfig"
import { ChunkSource$forEach } from "../random/ChunkSource$forEach"
import { Promise_fromThenable } from "../random/Promise_fromThenable"
import { FlightResponseProps, RSCSource } from "../random/types"
import { createFlightResponse } from "./createFlightResponse"
import { createClientConfig } from "./ClientConfig"

const IGNORE_ERROR = "IGNORE_ERROR"

interface FromProps {
  onClose?(): void
  onError?(error: Error): typeof IGNORE_ERROR | void
  signal?: AbortSignal
  responseProps?: Partial<FlightResponseProps>
}

type CreateClientConfigProps = Parameters<typeof createClientConfig>[0]

interface ReFrameClientProps extends CreateClientConfigProps {
  responseProps?: Partial<FlightResponseProps>
}

export default class ReFrameClient {
  static create<T>({ responseProps, ...props }: ReFrameClientProps) {
    const reframe = new ReFrameClient(createClientConfig(props))
    reframe.responseProps = responseProps
    return reframe
  }

  private responseProps?: Partial<FlightResponseProps>

  constructor(public readonly config: ReactFlightClientConfig) {
    const flight = new ReactFlightClient(this.config) // satisfies IReactFlightClient
    this.flight = flight
  }

  private readonly flight: ReactFlightClient
  get name() { return this.config.rendererPackageName } // prettier-ignore
  get version() { return this.config.rendererVersion } // prettier-ignore

  from<T>(rsc: RSCSource, props?: FromProps): Promise<T> {
    const response = createFlightResponse(this.flight, {
      bundlerConfig: null,
      serverReferenceConfig: null,
      moduleLoading: {
        status: "loaded",
        load(url, nonce, _onload, _onerror) {
          console.warn("moduleLoading.load called unexpectedly", "url", url, "nonce", nonce)
        },
      },
      ...this.responseProps,
      ...props?.responseProps,
    })

    void ChunkSource$forEach(
      rsc,
      (chunk) => {
        if (typeof chunk === "string") {
          this.flight.processStringChunk(response, chunk)
        } else {
          this.flight.processBinaryChunk(response, chunk)
        }
      },
      props?.signal,
    )
      .catch((error) => {
        const ignore = props?.onError?.(error) === IGNORE_ERROR
        if (ignore) return null
        console.warn("from error", error)
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
