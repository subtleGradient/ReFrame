/*

from the repo root
npm install
node main.ts
open http://0.0.0.0:3000/
should see a stream of time updates come in every second

*/

import { createServer } from "http"

function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "*",
    })
    res.end()
    return
  }

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "x-content-type-options": "nosniff",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "*",
  })

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
}

const server = createServer(handler)
server.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3000)
console.log(`Server running at`, server.address())
