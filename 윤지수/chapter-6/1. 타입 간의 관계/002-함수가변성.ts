// Crow <: Bird <: Animal
class Animal {}
class Bird extends Animal {
  chirp() {}
}
class Crow extends Bird {
  caw() {}
}

function chirp(bird: Bird): Bird {
  bird.chirp();
  return bird;
}

chirp(new Animal());
chirp(new Bird());
chirp(new Crow());

function clone(f: (b: Bird) => Bird): void {
  let parent = new Bird();
  let babyBird = f(parent);
  babyBird.chirp();
}

function birdToBird(b: Bird): Bird {
  // ...
  return new Bird();
}
clone(birdToBird);

function birdToCrow(b: Bird): Crow {
  // ...
  return new Crow();
}
clone(birdToCrow);

function birdToAnimal(b: Bird): Animal {
  // ...
  return new Animal();
}
// clone에 Animal을 반환하는 함수 f를 전달하면 f의 반환값에 .chirp를 호출할 수 없다.
clone(birdToAnimal);

// 함수의 반환타입은 공변, 즉 함수가 다른 함수의 서브타입이라면 '서브타입 함수의 반환 타입 <: 다른 함수의 반환 타입'을 만족해야 한다.

function animalToBird(a: Animal): Bird {
  // ...
  return new Bird();
}
clone(animalToBird);

function crowToBird(c: Crow): Bird {
  c.caw();
  return new Bird();
}
// clone에 crowToBird를 전달하면 .caw는 Crow에만 정의되어 있고 Bird에는 정의되어 있지 않으므로 예외가 발생한다.
clone(crowToBird);

// 함수의 매개변수, this 타입은 반변이다. 함수가 다른 함수의 서브타입이라면 '서브타입 함수의 매개변수와 this 타입 >: 다른 함수의 대응하는 매개변수'라는 조건을 만족해야 한다.
