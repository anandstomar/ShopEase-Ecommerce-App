const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
  }
  
  type Query {
    products: [Product]
  }
  
  type Mutation {
    addProduct(name: String!, price: Float!, description: String): Product
  }
`;

module.exports = typeDefs;
