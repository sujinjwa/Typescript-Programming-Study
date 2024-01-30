// 널이 될 수 있는 특별한 상황(T | null 또는 T | null | undefined 타입)을 대비해 타입스크립트는 어떤 값의 타입이 null이나 undefined가 아니라 T임을 단언하는 특수 문법을 제공한다.

type Dialog = {
  id?: string;
};

function closeDialog(dialog: Dialog) {
  if (!dialog.id) {
    return;
  }
  // 화살표 함수 내부이므로 유효범위가 바뀌었다.
  // 타입스크립트는 document.getElementById를 호출하면 HTMLElement | null을 반환한다는 사실만 알고 있을 뿐이다.
  // 우리는 결과값이 항상 null이 아닌 HTMLElement임을 알지만, 우리가 제공한 타입에만 의존하는 타입스크립트는 이 사실을 알지 못한다.
  setTimeout(() => removeFromDOM(dialog, document.getElementById(dialog.id)));
  setTimeout(() => removeFromDOM(dialog, document.getElementById(dialog.id!)!));
}

function removeFromDOM(dialog: Dialog, element: Element) {
  // 우리는 DOM에 다이얼로그가 있으며 부모 DOM 노트도 있다는 사실을 알고 있지만 타입스크립트는 element.parentNode가 Node | null이라는 사실만 알 뿐이다.
  element.parentNode.removeChild(element);
  element.parentNode!.removeChild(element);

  delete dialog.id;
}

// 대상이 null인지 여부를 확실할 수 없다면 필요한 모든 곳에 if (_ === null)을 추가한다.

// 하지만 대상이 null | undefined가 아님을 확신하는 경우라면 타입스크립트가 제공하는 특별 문법을 활용할 수 있다.
// nonnull 어서션 연산자(!)
// null이거나 undefined일 수 있는 타입 뒤에 nonnull 어서션이 따라오면 타이스크립트는 가령 T | null | undefined로 정의된 타입은 T로, number | string | null로 정의된 타입은 number | string으로 바꾼다.

// nonnull 어서션을 너무 많이 사용하고 있다는 생각이 들면 코드를 리팩터링해야 한다는 징후일 수 있다.

// Dialog를 두 타입의 유니온으로 분리해 어서션을 제거할 수 있다.
type VisibleDialog = { id?: string };
type DestroyedDialog = {};
type DialogNew = VisibleDialog | DestroyedDialog;

function closeDialogNew(dialog: DialogNew) {
  if (!("id" in dialog)) {
    return;
  }
  // dialog에 id 프로퍼티가 정의되었음을 확인한 뒤로는(VisibleDialog) 화살표 함수 내에부에서도 타입스크립트는 dialog의 참조가 바뀌지 않았음을 안다.
  setTimeout(() => removeFromDOMNew(dialog, document.getElementById(dialog.id)!));
}

function removeFromDOMNew(dialog: VisibleDialog, element: Element) {
  element.parentNode!.removeChild(element);

  delete dialog.id;
}
