/*

from the repo root
bun sh
cd demos/reframe-server-demo-deno-0
deno run --allow-net main.ts
open http://0.0.0.0:8000/
should see a stream of time updates come in every second

*/

function handler(_req: Request): Response {
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
      "content-type": "text/plain",
      "x-content-type-options": "nosniff",
    },
  })
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  Deno.serve(handler)
}
