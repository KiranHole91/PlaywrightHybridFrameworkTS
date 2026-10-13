import {test} from '../../fixtures/hooks-fixture'

test("API GET Test", async ({request}) => {

  const ids =  await request.get("/booking");
  console.log(await ids.json());

})

