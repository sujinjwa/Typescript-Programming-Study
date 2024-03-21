// ------------------------ 종합성 ------------------------

// 철저 검사(exhaustiveness checking)라고도 불린다.
// 명시적 반환값 타입사용 할까 말까

// ❌
// error 7030
// function isWaste(money : number) {
//   if (money > 1000) {
//     return true;
//   }
// }

type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Weekend = 'Sat' | 'Sun';
type Days = WeekDay | Weekend;

// 실수로 모든 요일을 완성하지 않았는데 컴파일타임에 에러를 못잡았음
const nextDay = {
  Mon: 'Tue',
};

// const nextDay : Record<Days, Days>
// const nextDayMapped: {
//   [Day in Days]: Days;
// };

// Mapped타입과 Record를 사용했으면 괜찮았을거다
