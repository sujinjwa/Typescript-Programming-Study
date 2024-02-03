import React from "react";
import FancyButon from "./002-함수형컴포넌트";

type Props = {
  firstName: string;
  userId: string;
};

type State = {
  isLoading: boolean;
};

class SignupForm extends React.Component<Props, State> {
  // 프로퍼티 초기화 과정에서 로컬 상태에 기본값을 선언한다.
  state = { isLoading: false };
  render() {
    return (
      <>
        <h2>{this.props.firstName}</h2>
        <FancyButon
          isDisabled={this.state.isLoading}
          size="Big"
          text="Sign Up Now"
          onClick={this.signUp}
        />
      </>
    );
  }
  private signUp = async () => {
    this.setState({ isLoading: true });
    try {
      await fetch("/api/signup?userId=" + this.props.userId);
    } finally {
      this.setState({ isLoading: false });
    }
  };
}

// SignupForm 인스턴스화
// new SignupForm({firstName: "Albert", userId:"13ab9g3"})으로 직접 인스턴스화할 수도 있지만 그러면 리액트가 SignupForm의 생명주기를 관리할 수 없게 된다.
let form = <SignupForm firstName="Albert" userId="13ab9g3" />;

// 타입스크립트가 다음을 확인하도록 지시한 것이다.
// - 필요한 모든 상태 필드를 state 초기자나 생성자에서 정의했는가?
// - props와 state에 접근한 값이 실제 존재하며 의도한 타입을 갖고 있는가?
// - this.state에 값을 직접 쓰지는 않는가?(리액트에서는 상태 갱신 시 반드시 setState API를 이용해야 한다.)
// - render를 호출하면 JSX를 반환하는가?
