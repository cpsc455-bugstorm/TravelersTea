## How run the backend?

Go into our server folder.
`cd server`  
Install dependencies
`yarn install`

Configure `.env` file.

1. Create a new file `.env` in the `server` folder at the root level.
2. Go to discord's [secret](https://discord.com/channels/1106050152587874364/1110797187463512116) channel. Paste the contents inside the `.env`

Actually run the backend  
`nodemon` (if you are developing)  
`yarn start` (if we are deploying I guess?)  
Now the following link : http://localhost:5001/api/user

## How to see our databases and how to use your own database?

To see some particular database, whether it is the shared one, of your own, follow the steps below.

1. Log in to [Mongo Atlas](https://www.mongodb.com/atlas/database) (press Sign In on the top right) 
2. Press `Database` -> `Browse Collection`
   ![image](https://github.com/cpsc455-bugstorm/TravelersTea/assets/69891690/6f477213-5d60-4a99-b9a4-0ce6ff65f468)

3. Here is our database! Our collections (think of SQL Tables), along with other helpful buttons, can be found here:
   ![image](https://github.com/cpsc455-bugstorm/TravelersTea/assets/69891690/b27d3f88-12b9-495d-bb9e-726ae3b1bd44)

To use your own database. Navigate to `config.js` in the `server` folder.

1. Simply change the `DB_USER_FLAG` to your name in all capital letters.
   ![image](https://github.com/cpsc455-bugstorm/TravelersTea/assets/69891690/8afeb6c7-e791-4e63-85ee-b6c41aa1282e)
