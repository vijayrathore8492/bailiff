import Bailiff from "./index";

export default (async function bailiffPromise() {
  return await Bailiff.loadCentralConfigs();
})();