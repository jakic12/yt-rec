const videoNetManager = require('./videoNet')
var fs = require(`fs`);
(async () => {
    const data = await videoNetManager.getAllVideoNetworks()
    const serialized = data.serialize();
    console.log(serialized)
    fs.writeFileSync(`docs/static.json`,JSON.stringify(serialized))
})()