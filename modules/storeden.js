import fetch from "node-fetch"

const getStoreden = async (endpoint) => {

    const URI = endpoint;

    const storeden_get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'key': process.env.KEY,
            'exchange': process.env.EXCHANGE
        }
    };

    const storedenRES = await fetch(URI, storeden_get);
    const storedenJson = await storedenRES.json();

    return storedenJson;

}

const notionRowProducts = async (orderID) => {

    const URI = `https://connect.storeden.com/v1.1/orders/order.json?orderID=${orderID}`;

    const storeden_get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'key': process.env.KEY,
            'exchange': process.env.EXCHANGE
        }
    };

    const storedenRES = await fetch(URI, storeden_get);
    const storedenJson = await storedenRES.json();

    const statuses = {
        "0": "Attesa Pagamento",
        "1": "Pagato",
        "2": "In allestimento",
        "3": "Inviato",
        "4": "Consegnato",
        "5": "Chiuso",
        "6": "Annullato"
      };
      
    const st = Object.keys(statuses).find(type => {
        if(type == storedenJson.status.toString()) {
        return statuses[type];
        }
    })
    
    const notionBody = Object.keys(storedenJson.cart.items).map((key, index) => {
        const { sku, title, count } = storedenJson.cart.items[key];
        return {
            "checked": false,
            "id":storedenJson.orderID,
            "fullname": storedenJson.delivery.fullname,
            "status": statuses[st],
            sku,
            title,
            count
        }
    });

    return notionBody;

}

export {getStoreden, notionRowProducts}