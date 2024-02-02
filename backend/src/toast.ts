function myDecorator(fn: Function) {
  return function() {
    console.log("Before");
    fn();
    console.log("After");
    
  }
}