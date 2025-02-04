const redis = require("../config/redis");
const Store = require("../models/StoreModels");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Store {
    _id: ID
    name: String
    description: String
    phoneNumber: String
    address: String
    since: String
    userId: ID
  }

  type Message {
    message: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllStores: [Store]
    getStoreById(_id: ID): Store
  }

  type Mutation {
    createStore(name: String, description: String, phoneNumber: String, address: String, since: String): Store
    updateStore(_id: ID, name: String, description: String, phoneNumber: String, address: String, since: String): Store
    deleteStore(_id: ID): Message
  }
`;

const resolvers = {
  Query: {
    getAllStores: async (_, args, contextValue) => {
      const { _id } = contextValue.auth();

      // const cache = await redis.get("stores");
      // if (cache) {
      //   return JSON.parse(cache);
      // }

      const stores = await Store.getAllStores(_id);
      await redis.set("stores", JSON.stringify(stores));

      return stores;
    },
    getStoreById: async (_, args, contextValue) => {
      contextValue.auth();
      const { _id } = args;

      const store = await Store.getStoreById(_id);

      return store;
    },
  },
  Mutation: {
    createStore: async (_, args, contextValue) => {
      const { _id } = contextValue.auth();
      const { name, description, phoneNumber, address, since } = args;

      const newStore = {
        name,
        description,
        phoneNumber,
        address,
        userId: _id,
        since,
      };

      const result = await Store.createStore(newStore);
      return newStore;
    },
    updateStore: async (_, args, contextValue) => {
      contextValue.auth()._id;
      const { _id, name, description, phoneNumber, address, since } = args;
      const store = await Store.updateStore(
        _id,
        name,
        description,
        phoneNumber,
        address,
        since
      );

      return store;
    },

    deleteStore: async (_, args, contextValue) => {
      contextValue.auth();
      const { _id } = args;

      await Store.deleteStore(_id);

      const message = {
        message: `Store with id ${_id} has successfully deleted`,
      };

      return message;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
