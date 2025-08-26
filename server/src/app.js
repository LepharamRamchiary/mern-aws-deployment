import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import path from "path"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

const _dirname = path.dirname("")
const buildPath = path.join(_dirname, "../client/dist")
app.use(express.static(buildPath))

//json data 
app.use(express.json({limit: "20kb"}))
//url data 
app.use(express.urlencoded({extended: true, limit: "20kb"}))

app.use(express.static("public"))
app.use(cookieParser())

// routes import
import taskRouter from "./routers/task.route.js"

// routes declaration
app.use("/api/v1/tasks", taskRouter)

export { app }