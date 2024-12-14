import { ReFrameServer } from "@subtlegradient/reframe/server"
import { Request, RequestHandler, Response } from "express"
import React from "react"

export interface ServerPageProps {
  signal: AbortSignal
  setHeader: Response["setHeader"]
  params: Request["query"]

  /** we don't want to tightly couple to express */
  req?: never
  res?: never
  next?: never
}

export function RSC$createRequestHandler(RootComponent: React.ComponentType<ServerPageProps>): RequestHandler {
  return async (req, res) => {
    res.setHeader("Transfer-Encoding", "chunked")
    // res.setHeader("Content-Type", "text/x-component") // the correct content type for streaming RSC
    res.setHeader("Content-Type", "text/event-stream") // makes cloudflare stream the response
    res.setHeader("Connection", "keep-alive")

    const abortController = new AbortController()

    req.on("close", () => {
      abortController.abort()
    })

    function Render() {
      return (
        <RootComponent
          signal={abortController.signal}
          params={req.query}
          setHeader={(key, value) => {
            if (key === "Content-Type") throw new Error("Cannot set Content-Type or else it'll break streaming")
            return res.setHeader(key, value)
          }}
        />
      )
    }

    const moduleBasePath = new URL("./", import.meta.url).href

    try {
      const rscStream = await ReFrameServer.renderToPipeableStream(<Render />, moduleBasePath, {
        environmentName: "Server",
        onError(error) {
          console.error("ReFrameServer onError", error)
          // Only end the response on error if it hasn't been sent yet
          if (!res.writableEnded) {
            res.end()
          }
        },
        onPostpone(reason) {
          console.error("ReFrameServer onPostpone", reason)
        },
      })
      rscStream.pipe(res)
    } catch (error) {
      console.error("Stream error:", error)
      if (!res.writableEnded) {
        res.end()
      }
    }
  }
}
