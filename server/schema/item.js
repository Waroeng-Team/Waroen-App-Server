const { ObjectId } = require("mongodb");
const Item = require("../models/ItemModels");

const itemEx = [
  {
    name: "Pepsi",
    imageUrl:
      "https://www.pepsi.com/content/dam/pepsi/en/brands/pepsi/pepsi-logo-horizontal.png",
    description:
      "Pepsi is a carbonated soft drink manufactured and manufactured by PepsiCo.",
    category: "Drink",
    stock: 100,
    buyPrice: 1000,
    sellPrice: 1500,
    createdAt: "2021-04-28T06:09:02.911Z",
    expiredAt: "2021-04-28T06:09:02.911Z",
    storeId: "66681bf2338fe8d36fd5663b",
    barcode: "123456789",
  },
];

const typeDefs = `#graphql
  
  type Item {
    _id: ID
    name: String
    imageUrl: String
    description: String
    category: String
    stock: Int
    buyPrice: Int
    sellPrice: Int
    createdAt: String
    storeId: ID
    barcode: String
  }

  type Message {
    message: String
  }

  type Query {
    getAllItems(storeId: ID!, search: String): [Item]
    getItemById(storeId: ID!, productId: ID!): Item
  }

  type Mutation {
    createItem(name: String!, imageUrl: String!, description: String!, category: String!, stock: Int!, buyPrice: Int!, sellPrice: Int!, createdAt: String!, storeId: ID!, barcode: String): Item
    updateItem(id: ID!, name: String!, imageUrl: String!, description: String!, category: String!, stock: Int!, buyPrice: Int!, sellPrice: Int!, storeId: ID!, barcode: String): Item
  }
`;

const resolvers = {
  Query: {
    getAllItems: async (parent, { storeId, search }, contextValue) => {
      contextValue.auth()._id;

      if (!storeId) {
        throw new Error("Please provide a storeId");
      }
      let dataSearch = search || "";
      const items = await Item.getAllItems(new ObjectId(storeId), dataSearch);
      return items;
    },
    getItemById: async (parent, { storeId, productId }, contextValue) => {
      contextValue.auth()._id;

      if (!storeId || !productId) {
        throw new Error("Please provide a storeId and productId");
      }
      const item = await Item.getItemById(
        new ObjectId(storeId),
        new ObjectId(productId)
      );
      return item;
    },
  },

  Mutation: {
    createItem: async (
      parent,
      {
        name,
        imageUrl,
        description,
        category,
        stock,
        buyPrice,
        sellPrice,
        createdAt,
        storeId,
        barcode,
      },
      contextValue
    ) => {
      contextValue.auth()._id;

      if (
        !name ||
        !imageUrl ||
        !description ||
        !category ||
        !stock ||
        !buyPrice ||
        !sellPrice ||
        !createdAt ||
        !storeId
      ) {
        throw new Error("Please fill all the fields which are required");
      }

      const newItem = {
        name,
        imageUrl,
        description,
        category,
        stock: 0,
        buyPrice,
        sellPrice,
        createdAt: new Date(createdAt),
        storeId: new ObjectId(storeId),
        barcode,
      };

      const realStock = stock;

      const item = await Item.createItem(newItem, realStock, storeId);

      // if (item.acknowledged === true) {
      //   return newItem;
      // }
      return item;
    },

    updateItem: async (
      parent,
      {
        id,
        name,
        imageUrl,
        description,
        category,
        stock,
        buyPrice,
        sellPrice,
        storeId,
        barcode,
      },
      contextValue
    ) => {
      contextValue.auth()._id;

      if (
        !name ||
        !imageUrl ||
        !description ||
        !category ||
        !stock ||
        !buyPrice ||
        !sellPrice ||
        !storeId
      ) {
        throw new Error("Please fill all the fields which are required");
      }

      const updatedItem = {
        _id: new ObjectId(id),
        name,
        imageUrl,
        description,
        category,
        stock,
        buyPrice,
        sellPrice,
        storeId: new ObjectId(storeId),
        barcode,
      };

      const item = await Item.updateItem(updatedItem);

      return item;
    },
  },
};

module.exports = { typeDefs, resolvers };
