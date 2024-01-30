// 타입스크립트는 구조에 기반한다.
// 때로는 이름 기반 타입도 아주 유용하다.

type CompanyIdBad = string;
type OrderIdBad = string;
type UserIdBad = string;
type IDBad = CompanyIdBad | OrderIdBad | UserIdBad;

function queryForUserBad(id: UserIdBad) {
  // ...
}

// UserId는 string의 별칭일 뿐이므로 이 정의로는 버그를 확실하게 방지할 수 없다.
let idBad: CompanyIdBad = "b4843361";
queryForUserBad(idBad);

// 이 상황은 이름 기반 타입이 유용한 사례
// 타입스크립트는 이름 기반 타입을 제공하지 않지만 타입 브랜딩이라는 기법으로 이를 흉내낼 수 있다.

// string과 { readonly brand: unique symbol } 인터섹션을 사용한 이유
// 이런 타입을 만드는 자연스러운 방법이 존재하지 않으며
// 이 타입의 값을 만들려면 반드시 어서션을 이용해야 하기 때문이다.
// 브랜디드 타입의 핵심적인 특징으로 실수로 잘못된 타입을 사용하기 아주 어렵게 해준다.

// unique symbol을 '브랜드'로 사용: 타입스크립트에서 실질적으로 제공하는 두 가지 이름 기반 타입 중 하나(나머지 하나는 enum)
// 그런 다음 이 브랜드를 string과 인터섹션하여 주어진 문자열이 우리가 정의한 브랜디드 타입과 같다고 어서션(as)할 수 있도록 한다.
type CompanyId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };
type UserId = string & { readonly brand: unique symbol };
type ID = CompanyId | OrderId | UserId;

function CompanyId(id: string) {
  return id as CompanyId;
}
function OrderId(id: string) {
  return id as OrderId;
}
function UserId(id: string) {
  return id as UserId;
}

function queryForUser(id: UserId) {
  // ...
}

let companyId = CompanyId("8aksdjnv");
let orderId = OrderId("9978sda1");
let userId = UserId("s23jn4kj");

queryForUser(userId);
queryForUser(companyId);
queryForUser(orderId);

// 런타임 오버헤드가 거의 없다는 것이 이 기법의 장점이다.
// 런타임에 모든 ID는 단순한 string이다. 즉, 브랜드는 순전히 컴파일 타임에만 쓰이는 구조물이다.
