# EasyExpress

This is a copy of the framework Express.js for the sake of learning about HTTP servers, protocols, requests, headers, encoding and more.

## Features

- Routing
- Send responses with text or files
- Get, Post, Put, Delete responses.
- Dynamic paths such as /hi/:user
- Automatic headers set and Content-Type with mimes database.
- Encoding with Gzip
- Middlewares

## Purpose

This project aims to copy exactly the Express.js syntax with a similar internal functionality. It has the basic functionalities of an HTTP server such as
route handling with get, post, put and delete, responses with text or files, encoding and response headers set automatically and Express.js functionalities 
like dynamic paths.

I learnt a lot about HTTP servers, HTTP responses and requests, headers, encoding and the internal functionality of Express.js in terms of routing, middlewares,
dynamic paths and more.

## Installing and use

To use it, you'll need Bun.

1. Clone the repository

```bash
git clone https://github.com/zYakro/EasyExpress.git
```

2. Use npm run dev to start the server

```bash
npm run dev
```

This will start the server under the server.ts in the example folder and it provides example of use of methods, routers, responses and dynamic paths. 
Middlewares can also be used.




