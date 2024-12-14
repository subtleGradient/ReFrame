import type * as Client from "./index.client"
import type * as Server from "./index.server"

type IClient = typeof Client
type IServer = typeof Server

type Hybrid = IClient | IServer
export default Hybrid
