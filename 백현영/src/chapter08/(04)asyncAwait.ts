// --------------- async/await ---------------

declare function getUserID<T>(value: T): Promise<T>;
declare function getLocation<T>(value: T): Promise<T>;

// promise 패턴
function getUser() {
  getUserID('songaji')
    .then((user) => getLocation(user))
    .then((location) => console.info(location))
    .catch((error) => console.error(error))
    .finally(() => console.info('DONE !'));
}

// async await 패턴
async function getUserAsync() {
  try {
    const userID = await getUserID('songaji');
    const location = await getLocation(userID);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  } finally {
    console.info('DONE !');
  }
}

export default null;
