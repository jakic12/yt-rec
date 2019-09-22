# yt-rec
Build a graph from recursively getting recommended videos, making a interconnected network of videos

# example graphs:
![videoNet](https://user-images.githubusercontent.com/37750012/65374162-fd9a7f80-dc86-11e9-816d-690eb0083f56.jpg)
![Screenshot_11](https://user-images.githubusercontent.com/37750012/65274010-b0050200-db22-11e9-8eb7-ccbe3698f02c.jpg)

# setup locally
1. clone the repo
2. `npm i`
4. `node index.js`
#### if you want to generate your own network files:
4. set up the enviroment variables
  Make a `.env` file in the root folder and assign this variables
  ```env
  CREDS_PATH="<folder with your oaut client secret>" //to store the oauth token once aquired
  CLIENT_SECRETS_PATH="<path to your ouath client secrets>"
  TOKEN_PATH="<path to where you want to store the token>"
  PORT="<port for the node server to listen to>"
  NETWORK_FOLDER="<path to where you want to store your network files>"
  ```
  example:
  ```env
  CREDS_PATH=".creds"
  CLIENT_SECRETS_PATH=".creds/client_secrets.json"
  TOKEN_PATH=".creds/token.json"
  PORT="3000"
  NETWORK_FOLDER=".networks"
  ```
5. setup oauth, [guide](https://developers.google.com/youtube/v3/quickstart/nodejs#step_1_turn_on_the)
6. run app and login to oauth
7. make a request to `<api_location>/generateNewNetwork/:videoId/:depth`
8. see the networks at `<api_location>/`
#### if you want to host statically
9. make folder docs/img/
10. run `node generateStatic`
11. host the docs folder
