require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT;
const videoNetManager = require('./videoNet')

app.get('/',(req, res) => {
    res.sendFile(process.cwd() + "/html/index.html");
})

app.get('/generateNewNetwork/:videoId/:depth', async (req, res) => {
    try{
        if(!req.params.videoId)
            throw new Error(`parameter videoId required`)

        if(!req.params.depth)
            throw new Error(`parameter depth required`)

        const data = await videoNetManager.getNewVideoNetwork(req.params.videoId, req.params.depth)
        res.send({data:data.serialize()})
    }catch(err){
        console.error(err)
        res.send({err:err.toString() || err})
    }
})

app.get('/getNetwork/:videoId/:depth/:timestamp', async (req, res) => {
    try{
        if(!req.params.videoId)
            throw new Error(`parameter videoId required`)

        if(!req.params.depth)
            throw new Error(`parameter depth required`)

        if(!req.params.timestamp)
            throw new Error(`parameter timestamp required`)
        
        const data = await videoNetManager.getVideoNetwork(req.params.videoId, req.params.depth, req.params.timestamp)
        res.send({data:data.serialize()})
    }catch(err){
        console.error(err)
        res.send({err})
    }
})

app.get('/getNetwork/:filename', async (req, res) => {
    try{
        if(!req.params.filename)
            throw new Error(`parameter filename required`)

        if(req.params.filename == `all`){
            const data = await videoNetManager.getAllVideoNetworks()
            res.send({data:data.serialize()})
        }else{
            const data = await videoNetManager.getVideoNetworkFromFilename(req.params.filename)
            res.send({data:data.serialize()})
        }
    }catch(err){
        console.error(err)
        res.send({err})
    }
})

app.get(`/listNetworks`, async (req, res) => {
    res.send(await videoNetManager.listVideoNetworks())
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))