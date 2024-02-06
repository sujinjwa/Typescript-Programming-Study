var Test = /** @class */ (function () {
  function Test(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }
  Test.prototype.sayName = function () {
    console.log(this.name);
  };
  return Test;
})();
