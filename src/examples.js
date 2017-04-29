let examples = {
	'Getting Started (Hello World)':`
# Click the ? above for more examples

'Hello world!'.print()
`,
	'Getting Started (Tables)' : `
# Tables are the only data structure
# in pear-script. They act as 
# arrays, maps, and functions.

# Table as an array
x: { 4 3 2 1 }
xSquared: x.map( (i){ i.^(2) } )
xSub0: x.get(0)

# Table as a map
y: { name: 'Bob' age: 19 }
isOver18: y.age.>(18)

# Table as an array and a map
z: { 98.2 85.2 90.2 75 gradesOf: 'Bob' }
finalAverage: z.sum()./( z.length() )	

# Table as a function
cubeMe: (x) { x.^(3) }
fiveCubed: cubeMe(5)
`,
	'Basic Class' : `
# Note that 'x' and 'y' are added to the Table
# during execution, so they do not need to be
# defined within our 'Point' table.
Point: (x y) {
	add: (p) { Point(x.+(p.x) y.+(p.y)) }
	distanceTo: (p) { 
		p.x.-(x).^(2).+(p.y.-(y).^(2)).sqrt() 
	}
}

# Initialize some Points
p1: Point(0 0)
p2: p1.add(Point(1 1))

result: p1.distanceTo(p2)

result.print()
result.is( 2.sqrt() ).print()
`,

	'Fibonacci Sequence' : `
fib: (n a b) {
	# 'a' and 'b' will act as defaults if not overwritten
	# when the function is called
	a: 1 
	b: 0
	a.print()
	n.>(0).then(
		{ fib(n.-(1) a.+(b) a) }
		a
	)
}

fib(10)`,
}

export default examples;