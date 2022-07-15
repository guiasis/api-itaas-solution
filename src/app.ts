import express from "express"
import routes from "./routes"
import cors from 'cors'

class App {
    public express: express.Application

    constructor() {
        this.express = express()
        this.express.use(express.json({ limit: '50mb' }))
        this.express.use(express.urlencoded({ extended: false, limit: '50mb' }))
        this.routes()
        this.middlewares()
    }

    private middlewares() {
        this.express.use(cors())
    }

    private routes() {
        this.express.use(routes)
    }
}

export default new App().express