import { ReFrameServer } from "@subtlegradient/reframe/server"
import { Request, RequestHandler, Response } from "express"
import React, { ComponentType } from "react"

export interface ServerPageProps {
  signal: AbortSignal
  setHeader: Response["setHeader"]
  params: Request["query"]

  /** we don't want to tightly couple to express */
  req?: never
  res?: never
  next?: never
}

const moduleBasePath = new URL("./", import.meta.url).href

export function RSC$createRequestHandler(RootComponent: React.ComponentType<ServerPageProps>): RequestHandler {
  return async (req, res) => {
    res.setHeader("Transfer-Encoding", "chunked")
    // res.setHeader("Content-Type", "text/x-component") // the correct content type for streaming RSC
    res.setHeader("Content-Type", "text/event-stream") // but this makes cloudflare stream the response
    res.setHeader("Connection", "keep-alive")

    try {
      const root = <Render {...{ RootComponent, req, res }} />

      const rscStream = await ReFrameServer.renderToPipeableStream(root, moduleBasePath, {
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
}

interface RenderProps {
  RootComponent: ComponentType<ServerPageProps>
  req: Request
  res: Response
}

function Render({ RootComponent, req, res }: RenderProps) {
  const abortController = new AbortController()

  req.on("close", () => {
    abortController.abort()
  })

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
