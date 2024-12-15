import { readFileSync } from "fs";
import type { Socket } from "net";
import * as path from "path";
import type Request from "./Request";
import { gzipEncode } from "./Encode";
import { getContentType } from "./utils";

interface statusLine {
  httpVersion: string,
  code: number,
  message: string
}

type headers = Record<string, string>

interface fileOptions {
  root: string
}

export default class Respond {
  private socket: Socket
  private statusLine: statusLine;
  private headers: headers;
  private body: string;
  private req: Request;

  constructor(req: Request, socket: Socket) {
    this.socket = socket;
    this.statusLine = {
      httpVersion: "HTTP/1.1",
      code: 200,
      message: "OK"
    }
    this.headers = {};
    this.body = ""
    this.req = req;
  }

  json(body: any) {
    this.setHeader("Content-Type", "application/json")

    return this.send(JSON.stringify(body))
  }

  send(body: any) {
    if (!this.headers.hasOwnProperty("Content-Type")) {
      this.setHeader("Content-Type", "text/html")
    }


    this.sendResponse(body)
  }

  sendFile(fileName: string, options: fileOptions, onErrorCallback: (err: any) => void) {
    try {
      const fileData = readFileSync(path.join(options.root, fileName), {
        encoding: "utf8",
        flag: "r"
      })

      const contentType = getContentType(fileName)

      this.setHeader("Content-Type", (contentType) ? contentType : 'text/plain')

      this.sendResponse(fileData)
    } catch (err) {
      onErrorCallback(err)
    }
  }

  sendStatus(code: number) {
    this.status(code)

    this.sendResponse();
  }

  status(code: number) {
    this.statusLine.code = code;
  }

  setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  setHeaders(headers: headers) {
    this.headers = headers;
  }

  private getParsedResponse(body?: string) {
    let parsedStatusLine = this.getParsedStatusLine()

    let parsedHeaders = this.getParsedHeaders()

    return `${parsedStatusLine}\r\n${parsedHeaders}\r\n${body}`
  }

  private getParsedStatusLine() {
    return `${this.statusLine.httpVersion} ${this.statusLine.code} ${this.statusLine.message}`
  }

  private getParsedHeaders() {
    let parsedHeaders: string = "";

    for (let [header, value] of Object.entries(this.headers)) {
      parsedHeaders += `${header}: ${value}\r\n`
    }

    return parsedHeaders
  }

  private sendResponse(body = "") {
    this.setHeader("Content-Length", `${body.length}`)

    if (body && this.req.headers.hasOwnProperty('Content-Encoding')) {
      body = this.applyContentEncoding(body)
    }

    const response = this.getParsedResponse(body)

    this.socket.write(response)

    this.end();
  }

  private applyContentEncoding(body: string) {
    const isEncodingAvailable = (encoding: string) =>
      this.req.headers["Content-Encoding"].includes(encoding)

    if (isEncodingAvailable("gzip")) {
      const compressedData = gzipEncode(body)

      this.setHeader('Content-Encoding', "gzip")

      return compressedData;
    }

    return body;
  }

  end() {
    this.socket.end();
  }
}