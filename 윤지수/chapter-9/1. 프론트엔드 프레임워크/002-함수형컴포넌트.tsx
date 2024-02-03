// TSX = JSX + 타입스크립트

import React from "react";

// 컴포넌트에 전달할 수 있는 프로퍼티 집합을 선언한다.
// 항상 객체 타입이며 이름은 Props로 짓는 것이 규칙이다.
type Props = {
  isDisabled?: boolean;
  size: "Big" | "Small";
  text: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
};

export function FancyButton(props: Props) {
  // 타입스크립트는 상태 정보가 boolean이라는 사실을 추론할 수 있다.
  // 만약 타입스크립트가 추론할 수 없는 타입(ex. 배열)을 사용한다면 타입을 명시해야 한다.
  // ex. useState<number[]>([])
  const [toggled, setToggled] = React.useState(false);
  return (
    <button
      className={"Size-" + props.size}
      disabled={props.isDisabled || false}
      onClick={(event) => {
        setToggled(!toggled);
        props.onClick(event);
      }}
    >
      {props.text}
    </button>
  );
}

// TSX 문법으로 FancyButton의 인스턴스를 만든다.
// FancyButton의 생명주기를 리액트가 관리하게 된다.
let button = (
  <FancyButton
    size="Big"
    text="Sign Up Now"
    onClick={() => console.log("Clicked!")}
  />
);

// 타입스크립트는 다음을 강제한다.
// - JSX 문법을 잘 지켜야 한다. 즉, 태그는 꼭 닫아야 하고, 올바르게 중첩해야 하며, 태그명에 오타가 있으면 안 된다.
// - 인스턴스화할 때 필요한 모든 프로퍼티를 전달해야 하며 프로퍼티는 모두 올바른 타입을 가져야 한다.
// - 인스턴스화할 때 필요한 프로퍼티만 전달하고 그 외에 프로퍼티는 전달하지 않는다.

export default FancyButton;
