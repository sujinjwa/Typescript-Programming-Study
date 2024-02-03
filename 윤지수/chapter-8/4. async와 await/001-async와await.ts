// Promise
function getUserPromise() {
  getUserID(18)
    .then((user) => getLocation(user))
    .then((location) => console.info("got locatioin", location))
    .catch((error) => console.error(error))
    .finally(() => console.info("done getting location"));
}

// async와 await
// 타입스크립트가 async와 await 기능을 완벽히 지원하며 아주 강력한 타입 안전성을 제공한다.
async function getUser() {
  try {
    let user = await getUserID(18);
    let location = await getLocation(user);
    console.info("got locatioin", location);
  } catch (error) {
    console.error(error);
  } finally {
    console.info("done getting location");
  }
}
