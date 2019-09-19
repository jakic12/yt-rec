require('dotenv').config()

const api = require(`./api.js`);
var fs = require(`fs`);

const networkFolder = process.env.NETWORK_FOLDER;

function getNewVideoNetwork(startVideo, depth){
    return new Promise( async (resolve, reject) => {
        let videoNet1 = new videoNet(startVideo);
        const auth = await api.authorize(await api.getClientSecrets())
        var videosToCheck = [startVideo]
        for(let i = 0; i < depth; i++)
            for(const parentVideo of videosToCheck){
                const recommendations = await api.getRecommendation(auth,parentVideo);
                videoNet1.addRecommendations(parentVideo, recommendations);
                videosToCheck = recommendations.map(e => e.id)
            }

        try {
            fs.mkdirSync(networkFolder);
        } catch (err) {
            if (err.code != 'EEXIST') {
                reject(err);
            }
        }

        fs.writeFile(`${networkFolder}/${startVideo}_${depth}_${new Date().getTime()}.json`, JSON.stringify(videoNet1.serialize()), (err) => {
          if (err) reject(err);
          console.log('data saved to ' + `network.json`);
          resolve(videoNet1);
        });
    });
}

function getVideoNetwork(startVideo, depth, timestamp){
    return new Promise((resolve, reject) => {
        fs.readFile(`${networkFolder}/${startVideo}_${depth}_${timestamp}.json`, (err, data) => {
            if(err) reject(err)
            resolve(new videoNet().deserialize(JSON.parse(data)))
        })
    });
}

function getVideoNetworkFromFilename(filename){
    return new Promise((resolve, reject) => {
        fs.readFile(`${networkFolder}/${filename.endsWith(`.json`)?filename:`${filename}.json`}`, (err, data) => {
            if(err) reject(err)
            resolve(new videoNet().deserialize(JSON.parse(data)))
        })
    });
}


function listVideoNetworks(){
    return new Promise((resolve, reject) => {
        try{
            resolve(fs.readdirSync(networkFolder))
        }catch(e){
            console.log(e)
            resolve([])
        }
    });
}

function videoNet(startVideo, videos = [], idToIndex = {}, indexToId = [], connections = []){
    this.startVideo = startVideo
    this.videos = videos
    this.idToIndex = idToIndex
    this.indexToId = indexToId
    this.connections = connections

    this.addRecommendations = (parentVideo, recommendations) => {
        for(const recommendation of recommendations){
            if(!idToIndex[recommendation.id]){
                console.log(parentVideo, `->`, recommendation.id)
                this.videos.push(recommendation);
                this.idToIndex[recommendation.id] = videos.length-1;
                this.indexToId[videos.length-1] = recommendation.id;
                this.connections.push({parent:parentVideo, child:recommendation.id})
            }
        }
    }

    this.serialize = () => {
        return {startVideo: this.startVideo, videos:this.videos, idToIndex:this.idToIndex, indexToId:this.indexToId, connections:this.connections}
    }

    this.deserialize = (data) => {
        return new videoNet(data.startVideo, data.videos, data.idToIndex, data.indexToId, data.connections);
    }
}

module.exports = {
    videoNet,
    getNewVideoNetwork,
    getVideoNetwork,
    listVideoNetworks,
    getVideoNetworkFromFilename
}