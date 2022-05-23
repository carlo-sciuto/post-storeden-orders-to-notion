const retrieveTags = (proprieties) => {
    const obj = Object.values(proprieties).reduce((obj, prop)=>{
        const { id, ...props } = prop;
        return { ...obj, [id]: props };
    });

    return obj[process.env.NOTION_TAGS_ID].select.options.map(opt => {
        return { id: opt.id, name: opt.name }
    })
}

export {retrieveTags}