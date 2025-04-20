const productService = require('../services/productService'); 

const resolvers = {
  Query: {
    products: async () => await productService.getAllProducts(),
  },
  Mutation: {
    addProduct: async (_, args) => await productService.createProduct(args),
  },
};

module.exports = resolvers;
