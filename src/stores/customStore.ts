import * as _ from 'lodash'
import * as fs from "fs";
import path from 'path';
import appRoot from 'app-root-path';
import Errors from '../errors';

export default class CustomStore {
  private static __configStore = {}

  public static add(configs: object | string, dirName: string) {
    if(typeof configs == "string") {
      configs = this.__readConfigsFromJsonFile(String(configs), dirName);
    }
    if(typeof configs == "object") _.extend(this.__configStore, configs);
  }

  public static get(name: string) {
    return this.__configStore[name];
  }

  private static __readConfigsFromJsonFile(relativePath: string, dirName: string): {}{
    const absolutePath = this.__absoluteValidPath(relativePath, dirName);
    if(!absolutePath) return {};
    
    return this.__readFromJsonFile(absolutePath);
  }

  private static __absoluteValidPath(relativePath: string, dirName: string){
    let absolutePath = path.join(appRoot.toString(), relativePath);
    if(fs.existsSync(absolutePath)) return absolutePath;
    
    absolutePath = path.join(dirName, relativePath);
    if(fs.existsSync(absolutePath)) return absolutePath;

    console.error(Errors["002"]);
    return false;
  }

  private static __readFromJsonFile(filePath: string): {}{
    let jsonData = {};
    try{
      const parsedJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if(Array.isArray(parsedJson)) {
        console.error(Errors["003"]);
      } else {
        jsonData = parsedJson;
      }
    }catch(e){
      console.error(Errors["004"]);
    }
    return jsonData;
  }
}