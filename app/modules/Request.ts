import Path from "./Path";

export default class Request {
  public bufferData: Buffer<ArrayBufferLike>
  public originalRequestData: string;

  public statusLine: Record<string, string>
  public originalStatusLine: string;

  public headers: Record<string, string>
  public originalHeaders: string[]

  public method: string;
  public path: string;
  public httpVersion: string;

  public baseUrl: string;
  public url: string;
  public query: Record<string, string>;
  public params: Record<string, string>

  public body: string

  constructor(bufferData: Buffer<ArrayBufferLike>) {
    this.bufferData = bufferData;
    this.originalRequestData = bufferData.toString();

    this.statusLine = {}
    this.originalStatusLine = ""

    this.headers = {}
    this.originalHeaders = []

    this.method = "";
    this.path = "";
    this.httpVersion = "";

    this.baseUrl = ""
    this.url = ""
    this.query = {}
    this.params = {}

    this.body = ""

    this.parseRequestData()
  }

  parseRequestData() {
    const [statusLineString, headersArray, body] = this.separateRequestData(this.originalRequestData)

    this.headers = this.parseHeaders(headersArray as string[]);
    this.originalHeaders = headersArray as string[]

    this.statusLine = this.parseStatusLine(statusLineString as string);
    this.originalStatusLine = statusLineString as string

    this.method = this.statusLine.method;
    this.path = this.statusLine.path;
    this.httpVersion = this.statusLine.httpVersion;

    this.url = this.statusLine.path
    this.path = this.statusLine.path
    this.baseUrl = this.getBaseUrl()
    this.query = this.getURLQueryParams()

    this.body = body as string
  }

  parseParams(dynamicUrl: string, staticUrl: string) {
    this.params = Path.parseParams(dynamicUrl, staticUrl)
  }

  getBaseUrl(path = this.path) {
    const deletedFirstSlash = path.slice(1)
    return deletedFirstSlash.slice(deletedFirstSlash.indexOf('/'))
  }

  getURLQueryParams(path = this.path) {
    const [_, queryParams = ""] = path.slice(path.indexOf('?'))

    const query: Record<string, string> = {}

    for (let segment of queryParams.split('&')) {
      const [variable, value] = segment.split('=');

      query[variable] = value
    }

    return query
  }

  parseStatusLine(statusLine: string) {
    const [method, path, httpVersion] = statusLine.split(" ", 2);

    return { method, path, httpVersion }
  }

  parseHeaders(headers: string[]): Record<string, string> {
    const headersMap: Record<string, string> = {};

    headers.map(header => {
      const [headerName, headerValue] = header.split(': ');

      headersMap[headerName] = headerValue
    })

    return headersMap;
  }

  separateRequestData(data: string) {
    const [requestLine, body] = data.split("\r\n\r\n")

    const [statusLineString, ...headersArray] = requestLine.split("\r\n")

    return [statusLineString, headersArray, body]
  }
}