function tester() {
  var i = 0;
  return function() {
    i++;
    return i;
  }
}

result = tester(); // a global variable so that tester() and its inner function
                   // will not be gabage collected during the whole execution
for(j = 0; j < 10; j++) {
  console.log(result());
}


// output: 1 2 3 4 5 6 7 8 9 10
