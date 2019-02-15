// JS:

function tester() {
  var i = 0;
  return function() {
    i++;
    return i;     // function is "bound" to the variable i
  }
}

result = tester(); // a global variable reference, so that tester() and its inner function
                   // will not be gabage collected during the whole execution
for(j = 0; j < 10; j++) {
  console.log(result());
}


// output: 1 2 3 4 5 6 7 8 9 10
// http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html





// Golang:

package main
import "fmt"

func tester() func() int {
	i := 0
	return func() int {
		i++
		return i   // function is "bound" to the variable i
	}
}

func main() {
	f := tester() // define a variable to record the tester() function
  
	for j:= 0 ; j < 10 ; j++ {
		fmt.Println(f())
	}
}




// fibonacci is a function that returns
// a function that returns an int.
package main
import "fmt"

func fibonacci() func() int {
	a := 0
	b := 1
	index := 0
	c := 0
	return func() int {
		if index == 0 {
		  c = 0
		} else if index == 1 {
		  c = 1
		} else {
			c = a + b
			a = b
			b = c
		}
		index++
		return c
	}
}

func main() {
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}
