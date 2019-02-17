Collection
==========
<a href="#1">1. Closure in JavaScript and Go</a><br>
<a href="#2">2. Pointer Receiver in Go</a><br>
<a href="#3">3. HashMap Implementation in Java</a><br>
<a href="#4">4. fmt.Springer Interface</a>
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
	a, b := 0, 1
	return func() int {
		c := a
		a, b = b, a + b
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
For methods with pointer receiver, if the argument is a value but not a pointer, Go will interpret v as (&v) automatically, and vice versa.
```go
package main
import "fmt"
type Vertex struct {
	X, Y float64
}
func (v *Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}
func (v Vertex) sum () float64 {
	return v.X + v.Y
}
func main() {
////v --> *v////////////////////////
	v := Vertex{3, 4}
	v.Scale(2)

	p := &Vertex{3, 4}
	p.Scale(2)

	fmt.Println(v, *p)
///*v --> v/////////////////////////	
	a := v.sum()
	
	b := p.sum()

	fmt.Println(a, b)
}
// output: {6 8} {6 8}  14 14
```



<a id="3"/><hr>
### 3.HashMap Implementation in Java
```java
import java.util.Arrays;
// API
// Data -> fields
// Constructor -> capacity, loadFactor, no parameter, overload
// Implementation -> deal with the possible null key
public class MyHashMap<K, V> {
    public static class Node<K, V> {
        final K key;
        V value;
        Node<K, V> next;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
            next = null;
        }

        public K getKey() {
            return key;
        }
        public V getValue() {
            return value;
        }
        public Node getNext() {
            return next;
        }
    }

    public static final int DEFAULT_CAPACITY = 1;
    public static final float LOAD_FACTOR = 0.75f;

    // Data -> fields:
    private int capacity; // length of the array
    private float loadFactor; // rehash load factor is fixed
    private int size; // size of the HashMap
    private Node[] array;

    public MyHashMap(int capacity, float loadFactor) {
        this.capacity = capacity;
        this.loadFactor = loadFactor;
        this.size = 0;
        array = new Node[capacity];
    }

    public MyHashMap() {
        this(DEFAULT_CAPACITY, LOAD_FACTOR);
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return (size == 0);
    }

    // put
    // If the key exists in the linked list: set value to new value
    // If the key doesn't exist: add it to head of the linked list
    public V put(K key, V value) {
        int index = getIndex(key);
        Node<K, V> newNode = new Node<>(key, value);
        Node<K, V> cur = array[index];
        while(cur != null) {
            if(equalsKey(cur.key, key)){
                V oldValue = cur.value;
                cur.value = value;
                return oldValue;
            }
            cur = cur.next;
        }
        newNode.next = array[index];
        array[index] = newNode;
        size++;
        if(needRehashing()) {
            rehash();
        }
        return null;
    }

    // get
    // If key exists: return value
    // If key doesn't exist: return null
    public V get(K key) {
        int index = getIndex(key);
        Node<K, V> cur = array[index];
        while(cur != null) {
            if(equalsKey(cur.key, key)) {
                return cur.value;
            }
            cur = cur.next;
        }
        return null;
    }

    // containsKey:
    // If contains key: return true
    // If doesn't contain key: return false
    public boolean containsKey(K key) {
        int index = getIndex(key);
        Node<K, V> cur = array[index];
        while(cur != null) {
            if(equalsKey(cur.key, key)) {
                return true;
            }
            cur = cur.next;
        }
        return false;
    }

    // remove:
    // If contains key: remove it in the linked list, return prev value
    // If doesn't contain key: return null
    public V remove(K key) {
        int index = getIndex(key);
        Node<K, V> cur = array[index];
        Node<K, V> prev = null;
        while(cur != null) {
            if(equalsKey(cur.key, key)) {
                prev.next = cur.next;
                cur.next = null;
                size--;
                return cur.value;
            }
            prev = cur;
            cur = cur.next;
        }
        return null;
    }

    // containsValue:
    // check each entry and the linked list to find the value
    public boolean containsValue(V value) {
        for(Node<K, V> node : array) {
            Node<K, V> cur = node;
            while(cur != null) {
                if(equalsValue(cur.value, value)) {
                    return true;
                }
                cur = cur.next;
            }
        }
        return false;
    }

    // clear:
    // fill all the entries of array with null
    public void clear() {
        Arrays.fill(array, null);
        size = 0;
    }


    // getIndex:
    // get index from hashCode
    public int getIndex(K key) {
        return hash(key) % array.length;
    }

    // hash:
    // get a positive hashCode
    // If key is null : hash = 0;
    // If key is not null : hash = a positive hash
    public int hash(K key) {
        if(key == null) {
            return 0;
        }
        return key.hashCode() & 0x7fffffff; // ensure that the hash is positive
    }

    // equalsKey:
    // check if key1 and key2 are equal or are both null
    public boolean equalsKey(K key1, K key2) {
        if(key1 == null && key2 == null) {
            return true;
        }
        if(key1 == null || key2 == null) {
            return false;
        }
        return key1.equals(key2);
    }

    // equalsValue:
    // check if value1 and value2 are equal or both are null
    public boolean equalsValue(V value1, V value2) {
        if(value1 == null && value2 == null) {
            return true;
        }
        if(value1 == null || value2 == null) {
            return false;
        }
        return value1.equals(value2);
    }

    // needRehashing():
    // check if the ratio of array.length / size <= LOAD_FACTOR
    public boolean needRehashing() {
        float ratio = (array.length + 0.0f) / size;
        return ratio <= LOAD_FACTOR;
    }

    // rehash():
    // create a new double-sized array
    // put all the entries into the new array
    public void rehash() {
        System.out.println("Rehashing start");
        Node<K, V>[] oldArray = this.array;
        Node<K, V>[] newArray = new Node[oldArray.length * 2];
        this.array = newArray;
        size = 0;
        capacity = oldArray.length * 2;
        for(Node<K, V> node : oldArray) {
            Node<K, V> cur = node;
            while(cur != null) {
                put(cur.key, cur.value);
                cur = cur.next;
            }
        }
        System.out.println("Rehashing over");
    }
}
```
Difference between mod and remainder: <br>
-21 mod 4 is 3 because -21 + 4 x 6 is 3.<br>
But -21 divided by 4 gives -5 with a remainder of -1.

<a id="4"/><hr>
### 4. fmt.Springer Interface 
Like override toString() in Java, we can define our own "naive" format for printing the value.
In GoDoc, this interface is written as:
```go
type Stringer interface {
        String() string
}
```
As an example: to print IP address in a format as "x.x.x.x".
```go
package main
import "fmt"
type IPAddr [4]byte
// Add a "String() string" method to IPAddr.
func (ip IPAddr) String() string {
	return fmt.Sprintf("%v.%v.%v.%v", ip[0], ip[1], ip[2], ip[3])
}
func main() {
	hosts := map[string]IPAddr{
		"loopback":  {127, 0, 0, 1},
		"googleDNS": {8, 8, 8, 8},
	}
	for name, ip := range hosts {
		fmt.Printf("%v: %v\n", name, ip)
	}
}
//	output:	loopback: 127.0.0.1
//		googleDNS: 8.8.8.8
```
