import * as net from "net"
import Request from "./Request";
import Respond from "./Respond";
import Router from "./Router";

export default class EasyExpressApp extends Router {
  private server: net.Server;
  public connections: net.Socket[];

  constructor() {
    super();

    this.server = net.createServer();
    this.connections = []

    this.handleConnection();
  }

  public useRouter(basePath: string, router: Router) {
    this.routers.push({
      basePath,
      router
    })
  }

  private handleConnection() {
    this.server.on("connection", (socket) => {
      this.connections.push(socket)

      this.handleRequest(socket)
    })
  }

  private handleRequest(socket: net.Socket) {
    socket.on("data", bufferData => {
      const req = new Request(bufferData)
      const res = new Respond(req, socket)

      this.handle(req, res)
    })
  }

  public listen(port: number, callback: () => void) {
    this.server.listen(port, callback);
  }
}