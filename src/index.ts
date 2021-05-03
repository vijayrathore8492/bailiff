import Bailiff from "./bailiff";

export default async function bailiffPromise() {
  return await Bailiff.loadCentralConfigs();
}