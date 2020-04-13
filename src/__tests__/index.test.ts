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
  })
})