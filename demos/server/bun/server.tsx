import { name } from "@subtlegradient/reframe/server"
import type { Serve } from "bun"

export default {
  async fetch(request, server) {
    console.log("fetch", request.url)
    return new Response("Hello from Bun!")
  },
} satisfies Serve<undefined>
