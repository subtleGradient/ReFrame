import express from "express"
import cors from "cors"
import defineRoutes from "./routes"
import { writeFileSync } from "fs"

const app = express()

app.use(cors())

defineRoutes(app)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  writeFileSync(`.status.json`, JSON.stringify({ port: process.env.PORT, startedAt: Date.now() }))
})
