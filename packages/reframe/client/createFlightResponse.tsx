import { FlightResponseProps, IReactFlightClient } from "../random/types"

export function createFlightResponse(
  flight: IReactFlightClient,
  remoteConfig: FlightResponseProps,
) {
  if ((global as any).__DEV__) flight.injectIntoDevTools()

  return flight.createResponse(
    remoteConfig.bundlerConfig,
    remoteConfig.serverReferenceConfig,
    remoteConfig.moduleLoading,
    remoteConfig.callServer,
    remoteConfig.encodeFormAction,
    remoteConfig.nonce,
    remoteConfig.temporaryReferences,
    remoteConfig.findSourceMapURL,
    remoteConfig.replayConsole,
    remoteConfig.environmentName,
  )
}
