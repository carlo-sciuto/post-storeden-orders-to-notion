import express from "express";
import 'dotenv/config'
import cors from 'cors'
import { Client } from "@notionhq/client"
import {getStoreden,notionRowProducts} from './modules/storeden.js'
import {retrieveTags} from './modules/notion.js'

const notion = new Client({ auth: process.env.NOTION_SECRET_KEY })

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('*', (req, res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.post('/order/:id' , async (req , res)=>{

    if(req.headers.key == process.env.AUTHKEY && req.params.id == process.env.ID_SHOP) {

        res.json(await notionRowProducts(process.env.TEST_ORDER))

    } else {
        res.status(200).json({auth: "invalid", error: 1})
    }

    res.end();

})

const port = process.env.PORT || 3000;

app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))