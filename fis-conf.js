// 编译jsx
fis.match('**.jsx', {
	parser: 'babel2',
	rExt: '.js'
})

// 编译less
fis.match('**.less', {
	parser: 'less',
	rExt: '.css'
})