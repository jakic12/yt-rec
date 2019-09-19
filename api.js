require('dotenv').config();
var fs = require(`fs`);
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

const clientSecretsPath = process.env.CLIENT_SECRETS_PATH;
const tokenPath = process.env.TOKEN_PATH;
const credsPath = process.env.CREDS_PATH;

function authorize(creds){
  return new Promise((resolve, reject) => {
    with(creds.installed){
      var oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);
    }
  
    // Check if we have previously stored a token.
    fs.readFile(tokenPath, async (err, token) => {
      if (err) {
        resolve( await getNewToken(oauth2Client));
      } else {
        oauth2Client.credentials = JSON.parse(token);
        resolve(oauth2Client);
      }
    });
  });
}

function getClientSecrets(){
  return new Promise((resolve, reject) => {
    fs.readFile(clientSecretsPath, (err, content) => {
      if(err){
        reject(`error loading secrets file: ${err}`);
        return;
      }
      resolve(JSON.parse(content));
    })
  });
}

function getNewToken(oauth2Client){
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
  
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.question('Enter the code from that page here: ', (code) =>{
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          reject(`Error while trying to retrieve access token ${err}`)
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        resolve(oauth2Client);
      });
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(credsPath);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + tokenPath);
  });
  console.log('Token stored to ' + tokenPath);
}

function video(id, snippet){
  return {id, ...snippet}
}

function getRecommendation(auth, video_id, resultCount = 10){
  return new Promise((resolve, reject) => {
    var service = google.youtube(`v3`)
    service.search.list({
      auth: auth,
      part:`snippet`,
      type: "video",
      maxResults:resultCount,
      relatedToVideoId:video_id
    }, (err, response) => {
      if(err){
        console.log(`The api returned an error:`, err)
        reject(err)
        return
      }

      let listOfVideoIds = []
      for (const videoResponce of response.data.items) {
        listOfVideoIds.push(video(videoResponce.id.videoId, videoResponce.snippet))
      }
      resolve(listOfVideoIds);
    })
  });
}

module.exports = {
  authorize,
  getClientSecrets,
  getRecommendation,
}
