const { btree, insert, deletion } = require("./btree.js");

for (let i = 1; i < 69; i++) {
	insert(btree, i, Math.round(Math.random() * 420));
}

for (let i = 1; i < 69; i++) {
	if (i != 42 && i != 33 && i != 1 && i!= 3) deletion(btree, i);
}
console.log(JSON.stringify(btree));