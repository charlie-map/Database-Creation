const m = 3;
const {
	btree,
	insert,
	deletion
} = require("./btree.js");

let cute_boy = [];

for (let i = 0; i < 69; i++) {
	cute_boy[i] = [i, Math.floor(Math.random() * 420)];
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffle(cute_boy);

for (let i = 0; i < cute_boy.length; i++) {
	insert(btree, cute_boy[i][0], cute_boy[i][1]);
}

console.log(check(btree, 0));
console.log(JSON.stringify(btree));

for (let i = 1; i < 69; i++) {
	if (i != 42 && i != 33 && i != 1 && i!= 3 && i!=8 && i!=16 && i!=26 && i!=67) deletion(btree, i);
}

console.log("\n\nAAHH", JSON.stringify(btree));

deletion(btree, 16);

console.log("\n\nAHH HARDER", JSON.stringify(btree));

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