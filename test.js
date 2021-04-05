const { btree, insert, deletion } = require("./btree.js");

for (let i = 1; i < 69; i++) {
	insert(btree, i, Math.round(Math.random() * 420));
}

for (let i = 1; i < 69; i++) {
	if (i != 42 && i != 33 && i != 1 && i!= 3) deletion(btree, i);
	if (i == 3) console.log("\nTREE AFTER", i, JSON.stringify(btree));
	if (i == 42 || i == 33 || i == 1 || i == 3) console.log("\nCURRENT TREE", i, JSON.stringify(btree), "\n");
}

console.log(btree, btree.children);
console.log(JSON.stringify(btree));