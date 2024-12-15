import ReactFlightClient from "@double-observer/react-client/flight"
import { ChunkSource$forEach } from "../random/ChunkSource$forEach"
import { Promise_fromThenable } from "../random/Promise_fromThenable"
import { FlightResponseProps, RSCSource } from "../random/types"
import { createClientConfig } from "./ClientConfig"
import { createFlightResponse } from "./createFlightResponse"

const IGNORE_ERROR = "IGNORE_ERROR"

interface FromProps {
  onClose?(): void
  onError?(error: Error): typeof IGNORE_ERROR | void
  signal?: AbortSignal
  remoteConfig?: Partial<FlightResponseProps>
}

type CreateClientConfigProps = Parameters<typeof createClientConfig>[0]

interface ReFrameClientProps extends CreateClientConfigProps {
  remoteConfig?: Partial<FlightResponseProps>
}

type FIXME = any

export default class ReFrameClient<P extends ReFrameClientProps> {
  static create<P extends ReFrameClientProps>(props: P) {
    return new ReFrameClient<P>(props)
  }

  private readonly config: ReturnType<typeof createClientConfig<FIXME, FIXME>>

  constructor(public readonly props: P) {
    this.config = createClientConfig(props)
    this.flight = new ReactFlightClient(this.config) // satisfies IReactFlightClient
  }

  private readonly flight: ReactFlightClient<FIXME>
  get name() { return this.props.config.rendererPackageName } // prettier-ignore
  get version() { return this.props.config.rendererVersion } // prettier-ignore

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
      ...this.props.remoteConfig,
      ...props?.remoteConfig,
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
