import ReactFlightClient from "@double-observer/react-client"
import { FlightResponseProps } from "@double-observer/react-client/src/ReactFlightClient"

export function createFlightResponse<F extends ReactFlightClient<any>>(flight: F, remoteConfig: FlightResponseProps) {
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
