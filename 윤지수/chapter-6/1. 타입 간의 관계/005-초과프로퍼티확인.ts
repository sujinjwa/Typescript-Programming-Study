// 타입스크립트가 한 객체 타입을 다른 객체 타입에 할당할 수 있는지 확인할 때도 타입 넓히기를 이용한다.
type Options = {
  baseURL: string;
  cacheSize?: number;
  tier?: "prod" | "dev";
};

class API {
  constructor(private options: Options) {}
}

new API({
  baseURL: "https:://",
  tier: "prod",
});

// 철자 틀린 경우
// 서브타입 전달했는데 타입스크립트는 에러로 판단
// 초과 프로퍼티 확인 기능으로 에러 검출
new API({
  baseURL: "https:://",
  tierr: "prod",
});

// 신선한 객체 리터럴 타입 T를 다른 타입 U에 할당하려는 상황에서 T가 U에는 존재하지 않는 프로퍼티를 가지고 있다면 타입스크립트는 이를 에러로 처리한다.
new API({
  baseURL: "https:://",
  badTier: "prod",
});

// 신선한 객체 리터럴 타입이란 타입스크립트가 객체 리터럴로부터 추론한 타입을 가리킨다.
// 객체 리터럴이 타입 어서션을 사용하거나 변수로 할당되면 신선한 객체 리터럴 타입은 일반 객체 타입으로 넓혀지면서 신선함을 사라진다.
new API({
  baseURL: "https:://",
  badTier: "prod",
} as Options);

let badOptions = {
  baseURL: "https:://",
  badTier: "prod",
};
new API(badOptions);

// 타입을 명시하면 신선한 객체로 취급
let options: Options = {
  baseURL: "https:://",
  badTier: "prod",
};
new API(options);
