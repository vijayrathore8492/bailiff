
import { MongoMemoryServer } from 'mongodb-memory-server';
const mongod = new MongoMemoryServer();
import { MongoClient } from 'mongodb';
import Liliput from '../index';

describe("Liliput", () => {
  
  describe("get", () => {
    describe("From .env", () => {
      beforeEach(()=>{
        process.env.A_DOTENV_CONF = 'aDotenvConf'
      })
      
      it("works", () => {
        expect(Liliput.get("A_DOTENV_CONF")).toEqual('aDotenvConf')
      })
    })

    describe("From .customStore", () => {
      const config = {"directJson": "it works"};
      beforeEach(()=>{
        Liliput.addStore(config)
          .addStore("../__stubs__/customConfig.json")
      })
      
      it("works for direct Json", () => {
        expect(Liliput.get("directJson")).toEqual(config["directJson"])
      })

      it("works for file json", () => {
        expect(Liliput.get("name")).toEqual("JWT_SECURE_KEY")
      })
    })

    describe("From central mongo db", () => {

      beforeAll(async() => {
        const configJson = [
          {
            "name": "INDEX_TEST",
            "value": "123",
            "status": 1
          }
        ];  
        process.env.LILIPUT_MONGO_URI = await mongod.getUri();
        process.env.LILIPUT_MONGO_DB = await mongod.getDbName();
        process.env.LILIPUT_MONGO_COLLECTION = "central_configs";
        const dbName = await mongod.getDbName();
        const uri = await mongod.getUri();
        const connection = await MongoClient.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        const db = await connection.db(dbName);
        await db.collection("central_configs").insertMany(configJson);
        connection.close();
        await Liliput.loadCentralConfigs();
      })

      afterAll(async () => {
        await mongod.stop();
      });

      it("works", () => {
        expect(Liliput.get("INDEX_TEST")).toEqual("123");
      })
    })
  })
})