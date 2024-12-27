import ReactServerDOMServer, { RenderOptions } from "@double-observer/react-server-dom-esm/server"
import type { ClientManifest } from "@double-observer/react-server-dom-esm/src/ReactFlightServerConfigESMBundler.js"
import { ReactClientValue } from "@double-observer/react-server/src/ReactFlightServer"
import { PassThrough } from "stream"

export default class ReFrameServer {
  static async renderToPipeableStream(
    model: ReactClientValue,
    moduleBasePath: ClientManifest,
    options?: RenderOptions,
  ) {
    return ReactServerDOMServer.renderToPipeableStream(model, moduleBasePath, options)
  }

  static async *renderToAsyncIterable(
    model: ReactClientValue,
    moduleBasePath: ClientManifest,
    options?: RenderOptions,
  ): AsyncIterable<string> {
    const pipeableStream = await ReFrameServer.renderToPipeableStream(model, moduleBasePath, options)

    const passThrough = new PassThrough()
    pipeableStream.pipe(passThrough)

    const textDecoder = new TextDecoder("utf-8")

    try {
      for await (const chunk of passThrough) {
        yield textDecoder.decode(chunk, { stream: true })
      }
    } finally {
      yield ""
    }
  }

  constructor() {
    throw new Error("FIXME: not sure what calling new ReFrameServer() should do yet")
  }
}
