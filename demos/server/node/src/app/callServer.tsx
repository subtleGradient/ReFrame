import { ReactServerValue } from "@double-observer/react-client/src/ReactFlightReplyClient"
import ReFrameServer, { ServerReference } from "@subtlegradient/reframe/server"
import bodyParser from "body-parser"
import type { Express, Response } from "express"
import invariant from "invariant"

const reframe_config_schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "ReFrame Configuration Schema",
  type: "object",
  required: ["callServer"],
  properties: {
    callServer: {
      type: "object",
      required: ["path"],
      properties: {
        path: {
          type: "string",
          pattern: "^/.*$",
          description: "The server path to call",
        },
      },
    },
  },
}

interface ReFrameConfig {
  $schema?: string
  callServer: {
    path: `/${string}`
  }
}

export function expressConfig(app: Express) {
  const callServer_route = "/rsc/callServer"

  app.get("/.well-known/reframe-config-schema.json", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600")
    res.json(reframe_config_schema)
  })

  app.get("/.well-known/reframe-config.json", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600")
    const base = req.protocol + "://" + req.get("host")
    res.json({
      $schema: `${base}/.well-known/reframe-config-schema.json`,
      callServer: {
        path: callServer_route,
      },
    } satisfies ReFrameConfig)
  })

  // TODO: automate this?
  const allowList = new Map<string, () => Promise<ServerReference<any>>>()

  allowList.set("app/Hello.tsx#HelloMessage$onClick", async () => {
    const { HelloMessage$onClick } = await import("./Hello")
    return HelloMessage$onClick
  })

  app.post(callServer_route, bodyParser.text(), async function (req, res): Promise<void> {
    invariant(req.method === "POST", "callServer must be POST")

    const serverReference = req.get("rsc-action")
    console.log("serverReference", serverReference)
    if (!serverReference) return void res.status(400).send("Missing rsc-action header")
    if (!allowList.has(serverReference)) return void res.status(400).send("Invalid reference")

    const serverValue = await allowList.get(serverReference)!()
    if (serverValue.$$typeof !== Symbol.for("react.server.reference")) {
      return void res.status(500).send("Invalid reference")
    }

    if (typeof serverValue !== "function") {
      res.status(200)
      sendRSC(res, serverValue)
      return
    }

    const { decodeReply } = await import("@double-observer/react-server-dom-esm/server")

    try {
      console.log("body", req.body)

      const args: Iterable<any> =
        (await decodeReply(req.body, moduleBasePath as any).then(
          (it) => it ?? [],
          (error) => {
            console.error("decodeReply error", error)
            return []
          },
        )) ?? []

      // console.log("multipart/form-data", req.is("multipart/form-data"))
      // console.log("body", `(((${req.body})))`)
      // console.log("headers", req.headers)

      // const form: FormData = new FormData(req.body)

      console.debug("serverValue", serverValue)
      console.debug("args", args)

      const responseValue = await serverValue(...args)
      console.debug("responseValue", responseValue)

      sendRSC(res, { error: null, value: responseValue })
      return
    } catch (error) {
      console.error(error)
      res.status(500)
      res.send("Unexpected server error")
      return
    }

    // return void res.status(500).send("Not implemented")

    // if (false) {
    //   invariant(serverReference, "Missing rsc-action header")
    //   // This is the client-side case
    //   const action = (await import(filepath))[name]
    //   // Validate that this is actually a function we intended to expose and
    //   // not the client trying to invoke arbitrary functions. In a real app,
    //   // you'd have a manifest verifying this before even importing it.
    //   if (action.$$typeof !== Symbol.for("react.server.reference")) {
    //     throw new Error("Invalid action")
    //   }

    //   let args
    //   if (req.is("multipart/form-data")) {
    //     return void res.status(500).send("Not implemented")

    //     // // Use busboy to streamingly parse the reply from form-data.
    //     // const bb = busboy({headers: req.headers});
    //     // const reply = decodeReplyFromBusboy(bb, "moduleBasePath");
    //     // req.pipe(bb);
    //     // args = await reply;
    //   } else {
    //     args = await decodeReply(req.body, {} as any)
    //   }
    //   const result = action.apply(null, args)
    //   try {
    //     // Wait for any mutations
    //     await result
    //   } catch (x) {
    //     // We handle the error on the client
    //   }
    //   // Refresh the client and return the value
    //   // renderApp(res, result);
    // }

    // // This is the client-side case
    //   const [filepath, name] = serverReference.split("#")
    //   const action = (await import(filepath))[name]
    //   // Validate that this is actually a function we intended to expose and
    //   // not the client trying to invoke arbitrary functions. In a real app,
    //   // you'd have a manifest verifying this before even importing it.
    //   if (action.$$typeof !== Symbol.for("react.server.reference")) {
    //     throw new Error("Invalid action")
    //   }

    //   let args
    //   if (req.is("multipart/form-data")) {
    //     // Use busboy to streamingly parse the reply from form-data.
    //     const bb = busboy({ headers: req.headers })
    //     const reply = decodeReplyFromBusboy(bb, moduleBasePath)
    //     req.pipe(bb)
    //     args = await reply
    //   } else {
    //     args = await decodeReply(req.body, moduleBasePath)
    //   }
    //   const result = action.apply(null, args)
    //   try {
    //     // Wait for any mutations
    //     await result
    //   } catch (x) {
    //     // We handle the error on the client
    //   }
    //   // Refresh the client and return the value
    //   renderApp(res, result)
    //
    //
    //
    // else {
    //   // This is the progressive enhancement case
    //   const UndiciRequest = require("undici").Request
    //   const fakeRequest = new UndiciRequest("http://localhost", {
    //     method: "POST",
    //     headers: { "Content-Type": req.headers["content-type"] },
    //     body: Readable.toWeb(req),
    //     duplex: "half",
    //   })
    //   const formData = await fakeRequest.formData()
    //   const action = await decodeAction(formData, moduleBasePath)
    //   try {
    //     // Wait for any mutations
    //     await action()
    //   } catch (x) {
    //     const { setServerState } = await import("../src/ServerState.js")
    //     setServerState("Error: " + x.message)
    //   }
    //   renderApp(res, null)
  })
}

const moduleBasePath = new URL("..", import.meta.url).href

async function sendRSC(res: Response, serverValue: ReactServerValue) {
  res.setHeader("Transfer-Encoding", "chunked")
  // res.setHeader("Content-Type", "text/x-component") // the correct content type for streaming RSC
  res.setHeader("Content-Type", "text/event-stream") // but this makes cloudflare stream the response
  res.setHeader("Connection", "keep-alive")

  try {
    const rscStream = await ReFrameServer.renderToPipeableStream(serverValue, moduleBasePath, {
      environmentName: "Server",
      identifierPrefix: "ReFrameServer",
      onError(error) {
        console.error("ReFrameServer onError", error)
        if (!res.writableEnded) res.end()
      },
      onPostpone(reason) {
        console.error("ReFrameServer onPostpone", reason)
      },
    })

    rscStream.pipe(res)
  } catch (error) {
    console.error("Stream error:", error)
    if (!res.writableEnded) res.end()
  }
}

console.log("ReFrameServer", "moduleBasePath", moduleBasePath)
