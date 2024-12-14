import type { Express } from "express"
import { RSC$createRequestHandler } from "./rsc"
import Hello from "./app/Hello"

export default function defineRoutes(app: Express) {
  app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/plain")
    res.setHeader("x-content-type-options", "nosniff")

    let timer: ReturnType<typeof setInterval> | undefined

    timer = setInterval(() => {
      const message = `It is ${new Date().toISOString()}\n`
      res.write(message)
    }, 1000)

    req.on("close", () => {
      if (timer !== undefined) {
        clearInterval(timer)
      }
    })
  })

  app.get("/rsc/hello", RSC$createRequestHandler(Hello))
}
