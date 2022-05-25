import express from "express";
import 'dotenv/config'
import cors from 'cors'
import {getStoreden,notionRowProducts} from './modules/storeden.js'
import {addOrder, retrieveTags} from './modules/notion.js'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('*', (req, res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
})

//endpoint for add orders by duplicating them for the products the customer ordered
app.post('/order/:id' , async (req , res)=>{

    if(req.headers.key == process.env.AUTHKEY && req.params.id == process.env.ID_SHOP) {

        const orderProducts = await notionRowProducts(req.body.id_order);

        const tags = await retrieveTags();

        const status = tags.find(tag => {
            if(orderProducts[0].status == tag.name) {
                return tag
            }
        })

        for(let order of orderProducts) {
            addOrder(
                order.checked,
                order.id,
                order.fullname,
                status.id,
                order.sku,
                order.title,
                order.count
            )
        }

        res.status(200).json({auth: "ok", order: orderProducts[0].id, fullname: orderProducts[0].fullname, success: true})

    } else {
        res.status(200).json({auth: "invalid", error: 1})
    }

    res.end();

})

/*
;(async () => {
    
    const database = await notion.databases.retrieve({
        database_id: process.env.NOTION_DB_ID,
    })
    const tags = retrieveTags(database.properties);



})()
*/

const port = process.env.PORT || 3000;

app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))