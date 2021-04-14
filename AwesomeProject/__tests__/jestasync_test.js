const Users=require( "../jestasync.js");


beforeAll(() => {
   
    Users.add('Minecraft',123);
  });
  
  afterAll(() => {
   Users.remove('Minecraft');
  });

  test("Minecraft is cool", () => {
   
      expect(Users.get("Minecraft")).resolves.toBe("Minecraft already exists");
  });
  