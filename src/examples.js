let examples = {
		'Basic Class' : `
Point: (x y) {
	add: (p) { Point(x.+(p.x) y.+(p.y)) }
	distanceTo: (p) { 
		p.x.-(x).^(2).+(p.y.-(y).^(2)).sqrt() 
	}
}

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