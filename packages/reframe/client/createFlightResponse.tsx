import { FlightResponseProps, IReactFlightClient } from "../random/types"

export function createFlightResponse(flight: IReactFlightClient, props: FlightResponseProps) {
  if ((global as any).__DEV__) flight.injectIntoDevTools()

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
