/*

from the repo root
bun sh
cd demos/reframe-server-demo-deno-0
deno run --allow-net main.ts
open http://0.0.0.0:8000/
should see a stream of time updates come in every second

*/

function handler(req: Request): Response {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "*",
      },
    })
  }

  let timer: ReturnType<typeof setInterval> | undefined
  const body = new ReadableStream({
    start(controller) {
      timer = setInterval(() => {
        const message = `It is ${new Date().toISOString()}\n`
        controller.enqueue(new TextEncoder().encode(message))
      }, 1000)
    },
    cancel() {
      if (timer !== undefined) {
        clearInterval(timer)
      }
    },
  })
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "*",
    },
  })
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  Deno.serve(handler)
}
