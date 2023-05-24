# Traveler's Tea

## Running the app

#### Make sure you are in the `client` folder when running these commands. 

_Install dependencies:_
```bash
yarn install
``` 

_Start app on [http://localhost:3000](http://localhost:3000)_
```bash
yarn start
```

#### Alternatively, if you are in the root directory or `TravelersTea/`, then do these commands.

_Install dependencies:_
```bash
cd client; yarn install
``` 

_Start app on [http://localhost:3000](http://localhost:3000)_
```bash
cd client; yarn start
```

## Folder Structure

#### Under `src`
  - `components`: where react elements go.
    - `common`: reusable components, such as `Button`, `Dropdown`, `Alert` etc. 
  - `reducers`: put redux reducers here.
  - `App.js`: the top-level React app. 
  - `index.css`: imports tailwind. Try not to modify this.
  - `store.js`: configures redux; link any new reducers here.

#### Under `public`

This is where assets (e.g. images) go, as well as the `index.html`.

#### tailwind.config.js

Configure tailwind and add custom tailwind keywords. 

Troubleshooting tips:
- Restart your IDE to fix tailwind autocomplete.

