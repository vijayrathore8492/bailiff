import DotenvStore from '../../stores/dotenvStore';

describe("DotenvStore", () => {
  
  describe("when key, value is there in process.env", () => {
    beforeEach(()=>{
      process.env.JWT_SECRET_KEY = '123'
    })
    
    it("returns value", () => {
      expect(DotenvStore.get("JWT_SECRET_KEY")).toEqual("123")
    })
  })

  describe("when key, value is not there in process.env", () => {
    beforeEach(()=>{
      delete process.env.JWT_SECRET_KEY;
    })
    
    it("returns undefined", () => {
      expect(DotenvStore.get("JWT_SECRET_KEY")).toEqual(undefined)
    })
  })
})