import DotenvStore from "./dotenvStore";
import * as fs from "fs";
import Errors from '../errors';
import * as _ from "lodash"
import { MongoClient } from 'mongodb';
import NodeCache from 'node-cache';

export default class CentralStore {
  static jsonConfigFile = "./.centralConfig.json";
  static nodeCache = new NodeCache();

  public static get(name: string) {
    let value = this.nodeCache.get(`lilliput.config.${name}`)

    if ( value == undefined ){
      value = this.__searchInJsonFile(name)
      this.nodeCache.set(`lilliput.config.${name}`, value)
    }
    return value;
  }

  public static async loadCentralConfigs() {
    const connection = await MongoClient.connect(this.__mongoUrl(), 
      { promiseLibrary: Promise, useUnifiedTopology: true }
    );

    if (!connection) {
      console.error(Errors["001"]);
      return ;
    }

    const db = connection.db(DotenvStore.get("LILLIPUT_MONGO_DB"));
    const result = await db.collection(
                                String(DotenvStore.get("LILLIPUT_MONGO_COLLECTION"))
                              ).find({ "status": 1 }).toArray();
    connection.close();
    const jsonConfig = this.__parseResultAsJsonString(result);
    fs.writeFileSync(this.jsonConfigFile, JSON.stringify(jsonConfig));
    _.forEach(jsonConfig, (value, key) => {
      this.nodeCache.set(`lilliput.config.${key}`, value);
    });
  }


  private static __parseResultAsJsonString = (data: any []) => {
    return _.reduce(data, (result, entry) => {
      result[entry["name"]] = entry["value"];
      return result;
    },{});
  }

  private static __mongoUrl = () => {
    return DotenvStore.get("LILLIPUT_MONGO_URI") || (function(connString){
      connString += DotenvStore.get("LILLIPUT_MONGO_USER") ? DotenvStore.get("LILLIPUT_MONGO_USER") + ":" : "" ;
      connString += DotenvStore.get("LILLIPUT_MONGO_PASS") ? DotenvStore.get("LILLIPUT_MONGO_PASS") + "@" : "" ;
      connString += DotenvStore.get("LILLIPUT_MONGO_HOST")
      connString += DotenvStore.get("LILLIPUT_MONGO_PORT") ? ":" + DotenvStore.get("LILLIPUT_MONGO_PORT") : "";
      return connString;
    }("mongodb://"));
  }

  private static __searchInJsonFile(name: string) {
    return JSON.parse(fs.readFileSync(this.jsonConfigFile, 'utf-8'))[name];
  }
}