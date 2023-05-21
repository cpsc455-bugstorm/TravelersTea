class ExampleService {
    constructor(exampleRepo) {
      this.exampleRepo = exampleRepo;
    }
  
    async getAll() {
      return this.exampleRepo.getAll();
    }

  }
  
  module.exports = ExampleService;