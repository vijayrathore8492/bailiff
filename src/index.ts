import CentralStore from "./stores/centralStore";
import DotenvStore from "./stores/dotenvStore";
import CustomStore from "./stores/customStore";
import callsite from 'callsite';
import path from 'path';
import * as _ from 'lodash'

export default class Liliput {
  private static __configStoresPrioritized = [
    CustomStore,
    DotenvStore,
    CentralStore
  ];

  public static addStore(config: {} | string){
    const stack = callsite(), requester = stack[1].getFileName();
    CustomStore.add(config, path.dirname(requester));
    return this;
  }

  public static get(name: string) {
    return _.reduce(this.__configStoresPrioritized, (value, store) => {
      return value ? value : store.get(name);
    }, "")
  }

  public static async loadCentralConfigs(){
    await CentralStore.loadCentralConfigs();
  }
}

Liliput.loadCentralConfigs();
