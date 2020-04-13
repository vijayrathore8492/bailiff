
import * as fs from "fs";
import path from 'path';
import CentralStore from '../../stores/centralStore';
import DotenvStore from '../../stores/dotenvStore';
import sinon from 'sinon';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
const mongod = new MongoMemoryServer();

const configJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../../__stubs__/configs.json"), 'utf-8'));  

// when mongod killed, it's running status should be `false`
mongod.getInstanceInfo();
describe("CentralStore", () => {
  beforeAll(async () => {
    const dbName = await mongod.getDbName();
    const uri = await mongod.getUri();
    const connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = await connection.db(dbName);
    await db.collection("central_configs").insertMany(configJson);
    connection.close();
    sinon.stub(DotenvStore, 'get').callsFake((str) => {
      if(str == "LILIPUT_MONGO_URI") return uri;
      if(str == "LILIPUT_MONGO_DB") return dbName;
    })
    await CentralStore.loadCentralConfigs();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it("loads data into jsonConfigFile", () => {
    expect(JSON.parse(
      fs.readFileSync(CentralStore.jsonConfigFile, 
        'utf-8'))
    ).toEqual({"JWT_SECURE_KEY": "123", "JWT_SECURE_PASS": "secure_pass"});
  })

  it("returns value for available configs", () => {
    expect(CentralStore.get("JWT_SECURE_KEY")).toEqual("123");
  })

  it("returns undefined for unavailable configs", () => {
    expect(CentralStore.get("JWT_SECURE_KEY_UN")).toEqual(undefined);
  })
})
