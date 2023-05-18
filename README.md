# Traveller's Tea

This is a MERN stack project using TypeScript, with auto-linting and formatting set up using ESLint and Prettier.

## Prerequisites

1. Install [Node.js](https://nodejs.org/). This will include Yarn as well.
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/).

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/cpsc455-bugstorm/TravelersTea.git
   ```

2. Change to the project directory:

   ```
   cd TravelersTea
   ```

3. Install the backend dependencies:

   ```
   yarn
   ```

4. Change to the `client` directory:

   ```
   cd client
   ```

5. Install the frontend dependencies:

   ```
   yarn
   ```

## Running the Project

1. Start the backend server:

   ```
   yarn start
   ```

2. In a new terminal, change to the `client` directory and start the frontend development server:

   ```
   cd client
   yarn start
   ```

## Setting Up Auto-Linting and Formatting

1. Install the ESLint and Prettier extensions in your code editor (e.g., Visual Studio Code):

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

2. Enable "format on save" in your code editor settings. For example, in Visual Studio Code, add the following to your `settings.json`:

   ```
   "editor.formatOnSave": true,
   "editor.codeActionsOnSave": {
     "source.fixAll.eslint": true
   },
   "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
   ```

Whenever you save a file, it will automatically be formatted according to the Prettier configuration, and any linting issues will be highlighted by ESLint.
