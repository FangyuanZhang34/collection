Collection
==========
<a href="#1">1. Closure in JavaScript and Go</a><br>
<a href="#2">2. Pointer Receiver in Go</a>
<br><br><br><br>

<a id="1"/><hr>
### 1. Closure in JavaScript and Go
<a href="#1_1">JavaScript</a><br>
<a href="#1_2">Go</a>


#### JavaScript<a id="1_1"/>
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
// output: 1 2 3 4 5 6 7 8 9 10  (in each line)
```
http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html



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
// output: 0 1 1 2 3 5 8 13 21 34 (in each line)

```
<a id="2"/><hr>
### 2. Pointer Receiver in Go
No class in go, however, we can declare 'method' for a type that is defined in the same package.

```go
package main
import (
	"fmt"
	"math"
)
type MyInt int
func (i MyInt) Abs() int {
	if i < 0 {
		return int(-i)
	}
	return int(i)
}
func main() {
	i := MyInt(-1000)
	fmt.Println(i.Abs())
}
```
Methods with pointer receivers can <b>modify the value</b> to which the receiver points. 
Since methods often need to modify their receiver, pointer receivers are more common than value receivers.
```go
package main
import (
	"fmt"
)
type Vertex struct {
	X, Y float64
}
func (v *Vertex) Scale(f float64) {
	v.X = v.X * f  // with pointer receiver we can modify v
	v.Y = v.Y * f
}
func main() {
	v := Vertex{3, 4}
	v.Scale(10)
	fmt.Println(v)
}
// output: {30 40}
```

