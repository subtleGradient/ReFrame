import ReactFlightDOMClient from "@double-observer/react-server-dom-esm/client"
import ReactFlightClient from "@double-observer/react-client/flight"
import { ChunkSource$forEach } from "../random/ChunkSource$forEach"
import { Promise_fromThenable } from "../random/Promise_fromThenable"
import { createClientConfig, ModuleMap } from "./ClientConfig"
import { createFlightResponse } from "./createFlightResponse"
import { ReactFlightClientConfig } from "@double-observer/react-client/src/ReactFlightClientConfig"
import { FlightResponseProps } from "@double-observer/react-client/src/ReactFlightClient"
import { RSCSource } from "../random/types"
import { ReactServerValue } from "@double-observer/react-client/src/ReactFlightReplyClient"
import { TemporaryReferenceSet } from "@double-observer/react-client/src/ReactFlightTemporaryReferences"

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

export default class ReFrameClient<
  P extends ReFrameClientProps,
  C extends ReactFlightClientConfig = ReactFlightClientConfig,
> {
  static create<P extends ReFrameClientProps>(props: P) {
    return new ReFrameClient(props)
  }

  private readonly config: ReactFlightClientConfig

  // setServerConfig(serverConfig: ServerConfig) {
  //   this.serverConfig = serverConfig
  // }

  /**
   * url to the configuration of your rsc server
   * e.g. `https://example.com/.well-known/reframe-config.json`
   */
  // fetchServerConfig(rscConfigURL: URL) {

  // }

  constructor(public readonly props: P) {
    const { modules, config, debug } = props
    this.config = createClientConfig({ modules, config, debug })
    this.flight = new ReactFlightClient(this.config) // satisfies IReactFlightClient

    console.log(ReactFlightDOMClient)
  }

  private readonly flight: ReactFlightClient<C>
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

  encodeReply(
    value: ReactServerValue,
    options?: { temporaryReferences?: TemporaryReferenceSet; signal?: AbortSignal },
  ) {
    console.log("ReFrameClient", "encodeReply", { value, options })
    return ReactFlightDOMClient.encodeReply(value, options)
  }
}
