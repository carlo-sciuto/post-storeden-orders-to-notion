import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_SECRET_KEY })


const retrieveTags = async () => {

    const database = await notion.databases.retrieve({
        database_id: process.env.NOTION_DB_ID,
    })

    const obj = Object.values(database.properties).reduce((obj, prop)=>{
        const { id, ...props } = prop;
        return { ...obj, [id]: props };
    });

    return obj[process.env.NOTION_TAGS_ID].select.options.map(opt => {
        return { id: opt.id, name: opt.name }
    })
}

const addOrder = async (checked, id, fullname, orderstatus, sku, productTitle, count) => {
    notion.pages.create({
        parent: {
            database_id: process.env.NOTION_DB_ID
        },
        properties: {
            [process.env.NOTION_PROP_CHECK]: {
                checkbox: checked,
            },
            [process.env.NOTION_PROP_ID]: {
                title: [
                    {
                        type: "text",
                        text: {
                            content: id,
                        },
                    },
                ],
            },
            [process.env.NOTION_PROP_RAGIONESOCIALE]: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: fullname,
                        },
                    },
                ],
            },
            [process.env.NOTION_PROP_STATUS]: {
                select: {
                    id: orderstatus
                }
            },
            [process.env.NOTION_PROP_SKU]: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: sku,
                        },
                    },
                ],
            },
            [process.env.NOTION_PROP_PRODUCT]: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: productTitle,
                        },
                    },
                ],
            },
            [process.env.NOTION_PROP_QTY]: {
                number: count
            }

        }
    })
}

export {retrieveTags, addOrder}