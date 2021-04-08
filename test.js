const {
	btree,
	insert,
	deletion
} = require("./btree.js");

for (let i = 1; i < 69; i++) {
	insert(btree, i, Math.round(Math.random() * 420));
}

// for (let i = 1; i < 69; i++) {
// 	if (i != 42 && i != 33 && i != 1 && i!= 3) deletion(btree, i);
// 	if (i == 3) console.log("\nTREE AFTER", i, JSON.stringify(btree));
// }

deletion(btree, 32);
deletion(btree, 48);
deletion(btree, 65);
deletion(btree, 31);
deletion(btree, 16);
//console.log(btree, btree.children);

function check(b_tree) {
	let check_value = [];
	for (let i = 0; i < b_tree.key.length + 1; i++) {
		if (b_tree.children[i]) {
			check_value.push(check(b_tree.children[i]));
		} else {
			// change value
		}
	}
	return check_value;
}

console.log(check(btree));