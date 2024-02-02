// 비동기 코드를 다루는 프로미스를 더 편하게 사용할 수 있게 하는 패턴이다.
// 마치 동기 작업을 다루는 듯 비동기 작업을 처리할 수 있다.
type User = { name: string; id: number; lat: number; lng: number };
function getLocation(user: User) {
  const { lat, lng } = user;
  return new Promise(resolve => {
    resolve({ lat, lng });
  });
}

function getUserId(id: number): Promise<User> {
  return new Promise(resolve => {
    resolve({ name: 'blah', id, lat: 36.1234, lng: 36.134534 });
  });
}

function getUser1() {
  getUserId(18)
    .then(user => getLocation(user))
    .then(location => console.info('got location', location))
    .catch(error => console.error(error))
    .finally(() => console.info('done getting location'));
}

async function getUser2() {
  try {
    const user = await getUserId(18);
    const location = await getLocation(user);
    console.info('got location', location);
  } catch (error) {
    console.error(error);
  } finally {
    console.info('done getting location');
  }
}
