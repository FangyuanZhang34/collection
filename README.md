Collection
==========
<a href="#1">1.Closure in JavaScript and Go</a>
<br><br><br><br>

<a id="1"/>
### Closure in JavaScript and Go
<a href="#1_1">JavaScript</a><br>
<a href="#1_2">Go</a>

<a id="1_1"/>
#### JavaScript
```javascript
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
```
http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html


<a id="1_1"/>
#### Go<a id="1_2"/>
```go
// add by one
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
```


```go
// fibonacci
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
```
