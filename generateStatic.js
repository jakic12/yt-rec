const videoNetManager = require("./videoNet");
var fs = require(`fs`);
//put all the networks together
(async () => {
  const data = await videoNetManager.getAllVideoNetworks();
  const serialized = data.serialize();
  console.log(serialized);
  fs.writeFileSync(`docs/static.json`, JSON.stringify(serialized));

  //download all the images
  console.log(`downloading thumbnails:`)
  downloadAll(data.videos);
})();

request = require("request");

var download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    if (err) console.log(err);
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", callback);
  });
};

function downloadAll(videos, index = 0) {
  const video = videos[index];
  try {
    if (!fs.existsSync(`docs/img/${video.id}.jpg`)) {
      download(video.thumbnails? video.thumbnails.medium.url  : `https://i.ibb.co/H4NzBYT/no-image-icon-5.gif`, `docs/img/${video.id}.jpg`, function(err) {
          if (err) throw err;
          console.log(index + "/" + videos.length-1);
          if (videos.length == index + 1) {
            return;
          } else {
            downloadAll(videos, index + 1);
          }
        }
      );
    } else {
      downloadAll(videos, index + 1);
    }
  } catch (e) {
    console.log(e);
    setTimeout(() => {
      downloadAll(videos, index);
    }, 5000);
  }
}
