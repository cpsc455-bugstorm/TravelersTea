const ExampleController = require('./src/controllers/ExampleController');

const express = require('express');
const app = express();
app.use(express.json())
const port = 5000;


const apiRouter = express.Router()
app.use("/api", apiRouter)

const exampleController = new ExampleController()
exampleController.initRoutes(apiRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});