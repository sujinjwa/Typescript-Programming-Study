// 종합성 - 필요한 모든 상황을 제대로 처리했는지 타입 검사기가 검사하는 기능
// 타입스크립트는 다양한 상황의 모든 가능성을 확인하며, 빠진 상황이 있다면 이를 경고한다.

type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
type Day = Weekday | "Sat" | "Sun";

function getNextDay(w: Weekday): Day {
  switch (w) {
    case "Mon":
      return "Tue";
    // case "Tue":
    //   return "Wed";
    // case "Wed":
    //   return "Thu";
    // case "Thu":
    //   return "Fri";
    // case "Fri":
    //   return "Sat";
  }
}
