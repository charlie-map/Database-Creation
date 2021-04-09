const m = 3;
const {
	btree,
	insert,
	deletion
} = require("./btree.js");

for (let i = 1; i < 69; i++) {
	insert(btree, i, Math.round(Math.random() * 420));
}

for (let i = 68; i > 0; i--) {
	if (i != 42 && i != 33 && i != 1 && i!= 3 && i!=8 && i!=16) deletion(btree, i);
}

console.log(check(btree, 0));
console.log(JSON.stringify(btree));

function isSorted(array) {
	let last_value = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] < last_value) return false;
		last_value = array[i];
	}
	return true;
}

function isLess(array, key) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] > key) return false;
	}
	return true;
}

function isGreater(array, key) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] < key) return false;
	}
	return true;
}

function check(b_tree, depth) {
	let check_value = true;
	for (let key = 0; key < b_tree.key.length; key++) { // Chek its two children
		if (b_tree.children[key] && b_tree.children[key + 1]) {
			// run through both children's key values and make sure they are correct
			if (!isSorted(b_tree.children[key].key) || !isSorted(b_tree.children[key + 1].key)) check_value = false;
			if (!isLess(b_tree.children[key].key, b_tree.key[key]) || !isGreater(b_tree.children[key + 1].key, b_tree.key[key])) check_value = false;
			check_value = check(b_tree.children[key], depth + 1);
			check_value = check(b_tree.children[key + 1], depth + 1);
		} else {
			if ((b_tree.children[key] && !b_tree.children[key + 1]) || (!b_tree.children[key] && b_tree.children[key + 1])) check_value = false;
		}
	}
	return check_value;
}