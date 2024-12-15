import { EasyExpress } from "../app/EasyExpress";
import * as path from "path";

// Initialize the app
const app = EasyExpress()

app.get('/sayHi', (req, res) => {
  res.send("Hi")
})

// Use dynamic paths and use them 
app.get("/sayHi/:user", (req, res) => {
  res.send("Hi" + req.params.user)
})

app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname, "views")
  }

  // Send files
  res.sendFile('index.html', options, () => {
    console.log("Error")
  })
})

// Create a router and add routes to it

const router = EasyExpress.Router()

router.get("/hi", (req, res) => {
  res.send("Hi")
})

const router2 = EasyExpress.Router()

router2.get('/bye', (req, res) => {
  res.send('Bye')
})

// Use routers inside routers

router.use('/sayBye', router2)

// Add the router to the main app

app.use("/say", router)

// Add middlewares

app.use("/sayHi", (req, res, next) => {
  console.log('This is a middleware!')
  
  next()
})

// Run your app on a given port
app.listen(4221, () => {
  console.log("Server Running")
})