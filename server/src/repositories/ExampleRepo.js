// The repo deals with grabbing objects from DB 

class ExampleRepo {
//   constructor(model) {
//     this.model = model;
//   }
  constructor() {

  }

  async getAll() {
    const exampleObject = {
        message: "Hello world!"
    }
    return exampleObject
  }
}

module.exports = ExampleRepo;
