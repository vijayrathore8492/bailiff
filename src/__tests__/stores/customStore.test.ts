import CustomStore from '../../stores/customStore';
import sinon from 'sinon';
import Errors from '../../errors';

describe("CustomStore", () => {
  beforeAll(()=>{
    CustomStore.add({abc: "xyz"}, "");
  })

  describe("adding config file", ()=> {
    beforeAll(() => {
      CustomStore.add("../../__stubs__/customConfig.json", __dirname);
    })

    it("reads from all configs", () => {
      expect(CustomStore.get("name")).toEqual("JWT_SECURE_KEY")
    })
  })

  describe("adding invalid config files", ()=> {
    const jestSpy = jest.fn((str) => { return str})
    beforeAll(() => {
      sinon.stub(console, 'error').callsFake((str) => {
        jestSpy(str)
      })
    })

    it("when file does not exist", () => {
      CustomStore.add("../../__stubs__/nonExistingCustomConfig.json", __dirname);
      expect(jestSpy).toBeCalledWith(Errors["002"])
    })

    it("when file has array on root", () => {
      CustomStore.add("../../__stubs__/arrayCustomConfig.json", __dirname);
      expect(jestSpy).toBeCalledWith(Errors["003"])
    })

    it("when file is not a json file", () => {
      CustomStore.add("../../__stubs__/customConfig.js", __dirname);
      expect(jestSpy).toBeCalledWith(Errors["004"])
    })
  })
})