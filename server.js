require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const articles = require("./src/routes/articles");

const app = express();
app.use(express.json());
app.use("/api/articles", articles);

async function connect() {
  const uri = process.env.MONGO_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log("MongoDB:", uri.replace(/\/\/.*@/, "//"));
      return;
    } catch (error) {
      console.log("Строка из .env недоступна, поднимаю встроенный MongoDB");
    }
  }
  const { MongoMemoryServer } = require("mongodb-memory-server");
  const memory = await MongoMemoryServer.create();
  await mongoose.connect(memory.getUri("blog"));
  console.log("MongoDB: встроенный экземпляр");
}

connect()
  .then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`API http://127.0.0.1:${port}`));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
