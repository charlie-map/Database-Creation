const m = 3; // The maximum keys for each node - if the amount hits 3, the tree splits

let btree = { // This will be considered the root node
	key: [],
	payload: [],
	children: []
};

/* IMPORTANT NOTES:
		-> 0 is the first child (within children) - each node position in the list is the same as the value that
		is to the "left" of them
*/

function find_parent_object(b_tree, key, compare_level, level) {
	if (compare_level == 0) return 0; // This is the root node
	// look at current level and compare to what level we need to be on
	if (level == compare_level - 1) return b_tree;
	// Otherwise keep going down in levels
	// ^ First need to know which subtree to go in
	let child_pos = 0;
	for (bkey in b_tree.key) {
		child_pos += key > b_tree.key[bkey] ? 1 : 0;
	}
	return find_parent_object(b_tree.children[child_pos], key, compare_level, level + 1);
}

function quicksort(array, payload, low, high) {
	if (low < high) {
		let pivot = partition(array, payload, low, high);
		quicksort(array, payload, low, pivot - 1); // low side
		quicksort(array, payload, pivot + 1, high); // high side
	}
	return [array, payload];
}

function partition(array, payload, startlow, pivot) {
	let lowest = startlow - 1;
	let buffer;
	for (let j = startlow; j < pivot; j++) {
		if (array[j] < array[pivot]) {
			lowest++;
			buffer = array[j];
			array[j] = array[lowest];
			array[lowest] = buffer;
			// swap payload values
			buffer = payload[j];
			payload[j] = payload[lowest];
			payload[lowest] = buffer;
		}
	}
	buffer = array[lowest + 1];
	array[lowest + 1] = array[pivot];
	array[pivot] = buffer;
	// swap payload values
	buffer = payload[lowest + 1];
	payload[lowest + 1] = payload[pivot];
	payload[pivot] = buffer;
	return lowest + 1;
}

function split_node(b_tree) {
	let parent_pos = Math.floor(m / 2);
	let parent_key = b_tree.key[parent_pos];
	let parent_payload = b_tree.payload[parent_pos];
	let left_keys = b_tree.key.splice(0, parent_pos);
	let left_payloads = b_tree.payload.splice(0, parent_pos);
	let left_children = b_tree.children.splice(0, parent_pos + 1);
	let right_keys = b_tree.key.splice(parent_pos, m - (parent_pos - 1));
	let right_payloads = b_tree.payload.splice(parent_pos, m - (parent_pos - 1));
	let right_children = b_tree.children.splice(parent_pos - 1, m - (parent_pos - 1));
	b_tree.key = [parent_key];
	b_tree.payload = [parent_payload];
	b_tree.children[0] = {
		key: left_keys,
		payload: left_payloads,
		children: left_children
	};
	b_tree.children[1] = {
		key: right_keys,
		payload: right_payloads,
		children: right_children
	};
	return;
}

function insert(b_tree, key, value, depth) {
	depth = !depth ? 0 : depth;
	let key_pos = 0;
	let combine_compare = false; // Knowing if there is a need to combine the child up in the parent
	for (let run_through = 0; run_through < b_tree.key.length; run_through++) {
		if (key > b_tree.key[run_through]) key_pos++;
	}
	if (b_tree.children && b_tree.children[key_pos]) {
		combine_compare = insert(b_tree.children[key_pos], key, value, depth + 1);
	} else {
		// insert here and start fixing the tree upward
		b_tree.key.push(key);
		b_tree.payload.push(value);
		quicksort(b_tree.key, b_tree.payload, 0, b_tree.key.length - 1);
		if (b_tree.key.length == m) {
			split_node(b_tree);
			return true;
		}
	}
	if (!combine_compare) return false;
	// Pull up the child into the parent
	b_tree.key.push(b_tree.children[key_pos].key[0]);
	b_tree.payload.push(b_tree.children[key_pos].payload[0]);
	quicksort(b_tree.key, b_tree.payload, 0, b_tree.key.length - 1);
	let right_children = b_tree.children[key_pos].children[1];
	b_tree.children[key_pos] = b_tree.children[key_pos].children[0];
	while (b_tree.children[key_pos + 1]) {
		let buffer = b_tree.children[key_pos + 1];
		b_tree.children[key_pos + 1] = right_children;
		right_children = buffer;
		key_pos++;
	}
	b_tree.children[key_pos + 1] = right_children;
	if (b_tree.key.length == m) {
		split_node(b_tree);
		return true;
	}
	return false;
}

function search(b_tree, key) {
	let key_pos = 0;
	for (let i = 0; i < b_tree.key.length; i++) { // search through keys and see which child should be traversed to
		if (key == b_tree.key[i]) return b_tree;
		if (key > b_tree.key[i]) key_pos++;
	}
	if (typeof b_tree.children[key_pos] != "undefined") return search(b_tree.children[key_pos], key);
	return "No value found";
}

//insert(btree, 0, 816);
insert(btree, 5, 30);
insert(btree, 6, 4000);
insert(btree, 7, 21);
insert(btree, 1, 420);
insert(btree, 2, 360);
insert(btree, 3, 69);
insert(btree, 4, 816);
insert(btree, 8, 30);
insert(btree, 9, 4000);
insert(btree, 10, 21);
insert(btree, 11, 420);
insert(btree, 12, 360);
insert(btree, 13, 69);
insert(btree, 14, 816);
insert(btree, 15, 30);
// insert(btree, 6, 4000);
// insert(btree, 7, 21);

console.log(JSON.stringify(btree));

if (process.argv[2] == "search") console.log(search(btree, process.argv[3]));
if (process.argv[2] == "insert") {
	insert(btree, parseInt(process.argv[3], 10), process.argv[4], 0);
	console.log(JSON.stringify(btree));
}

function deletion(b_tree, key, depth, grand_father) {
	depth = !depth ? 0 : depth;
	let return_value;
	let key_pos = -1;
	let looking_at_key = grand_father ? grand_father : key;
	for (let bkey = 0; bkey < b_tree.key.length; bkey++) { // See if there's a key within the tree that matches the key
		if (looking_at_key == b_tree.key[bkey]) { // When key_pos != -1, we need to remove something
			key_pos = bkey;
			break;
		} else if (looking_at_key > b_tree.key[bkey]) {
			key_pos = bkey + 1;
		}
		key_pos = b_tree.key.length - 1 == bkey && key_pos == -1 ? 0 : key_pos;
	}
	if (b_tree.key[key_pos] != looking_at_key || (b_tree.children[key_pos] && b_tree.children[key_pos].children.length)) {
		if (b_tree.children.length == 0) {
			if (b_tree.key[key_pos] == key) {
				b_tree.key.splice(key_pos, 1);
				b_tree.payload.splice(key_pos, 1);
				return "Single root";
			}
			return "No value under the specified key";
		}
		if (b_tree.children[key_pos].children.length && b_tree.key[key_pos] == key) {
			grand_father = key - 1;
		}
		return_value = deletion(b_tree.children[key_pos], key, depth + 1, grand_father);
	} else {
		if (b_tree.children.length) { // Pull up a child
			return_value = [0];
			b_tree.key[key_pos] = b_tree.children[key_pos].key[b_tree.children[key_pos].key.length - 1];
			b_tree.payload[key_pos] = b_tree.children[key_pos].payload[b_tree.children[key_pos].payload.length - 1];
			b_tree.children[key_pos].key.splice(b_tree.children[key_pos].key.length - 1, 1);
			b_tree.children[key_pos].payload.splice(b_tree.children[key_pos].payload.length - 1, 1);
		} else {
			let key_value = !grand_father ? b_tree.key.splice(key_pos, 1)[0] : b_tree.key.splice(b_tree.key.length - 1, 1)[0];
			let payload_value = !grand_father ? b_tree.payload.splice(key_pos, 1)[0] : b_tree.payload.splice(b_tree.payload.length - 1, 1)[0];
			return [key_value, payload_value];
		}
	}
	if (key_pos == b_tree.key.length) key_pos--;
	// Need to fix issues with the tree
	// Look at the children, check the cases
	if (b_tree.children[key_pos].key.length && b_tree.children[key_pos + 1].key.length && !grand_father) return return_value; // nothing needs changing
	// Make two variables so swapping can be generalized
	// look on both sides of our current node
	let full_node = b_tree.children[key_pos].key.length ? key_pos : key_pos + 1;
	let empty_node = b_tree.children[key_pos].key.length ? key_pos + 1 : key_pos;
	if (b_tree.children[key_pos - 1] && b_tree.children[key_pos - 1].key.length > 1 && b_tree.children[key_pos - 1].key.length > b_tree.children[key_pos + 1].key.length) {
		full_node = full_node == key_pos ? full_node : key_pos - 1;
		empty_node = empty_node == key_pos ? empty_node : key_pos - 1;
		key_pos--;
	}
	if ((b_tree.children[empty_node].key.length > 1 && !b_tree.children[full_node].key.length) ||
		(!b_tree.children[empty_node].key.length && b_tree.children[full_node].key.length > 1)) { // parent moves to empty, inner value of other node comes up
		b_tree.children[empty_node].key = [b_tree.key[key_pos]];
		b_tree.children[empty_node].payload = [b_tree.payload[key_pos]];
		let inner_most_node = full_node > key_pos ? [b_tree.children[full_node].key[0], b_tree.children[full_node].payload[0]] :
			[b_tree.children[full_node].key[b_tree.children[full_node].key.length - 1], b_tree.children[full_node].payload[b_tree.children[full_node].payload.length - 1]]
		if (full_node > key_pos) {
			b_tree.key[key_pos] = inner_most_node[0];
			b_tree.payload[key_pos] = inner_most_node[1];
			b_tree.children[full_node].key.splice(0, 1);
			b_tree.children[full_node].payload.splice(0, 1);
		} else {
			b_tree.key[key_pos] = inner_most_node[0];
			b_tree.payload[key_pos] = inner_most_node[1];
			b_tree.children[full_node].key.splice(b_tree.children[full_node].key.length - 1, 1);
			b_tree.children[full_node].payload.splice(b_tree.children[full_node].payload.length - 1, 1);
		}
	} else { // one is empty, the other child has one: combine parent with that child
		// Big note: watch out for the empty one having a child
		let parent_key = b_tree.key.splice(key_pos, 1)[0];
		let parent_payload = b_tree.payload.splice(key_pos, 1)[0];
		b_tree.children[full_node].key.push(parent_key);
		b_tree.children[full_node].payload.push(parent_payload);
		quicksort(b_tree.children[full_node].key, b_tree.children[full_node].payload, 0, b_tree.children[full_node].key.length - 1);
		// Check the empty for having a child
		if (b_tree.children[empty_node].children.length) {
			if (full_node > key_pos) {
				b_tree.children[full_node].children = b_tree.children[empty_node].children.concat(b_tree.children[full_node].children);
			} else {
				b_tree.children[full_node].children.push(b_tree.children[empty_node].children[0]);
			}
		}
		b_tree.children.splice(empty_node, 1);
	}
	if ((!b_tree.key.length && depth == 0) || (grand_father && b_tree.children[0].key[key_pos] == key)) {
		if (return_value[0] == "No value under the specified key") return return_value[0];
		b_tree.children[0].key[key_pos] = (return_value[0] && return_value[1]) ? return_value[0] : b_tree.children[0].key[key_pos];
		b_tree.children[0].payload[key_pos] = (return_value[0] && return_value[1]) ? return_value[1] : b_tree.children[0].payload[key_pos];
		b_tree.key = b_tree.children[0].key;
		b_tree.payload = b_tree.children[0].payload;
		b_tree.children = b_tree.children[0].children;
	}
	return return_value;
}

deletion(btree, 15);
console.log("\nCURRENT", JSON.stringify(btree), "\n");
// deletion(btree, 4);
// console.log("\n", JSON.stringify(btree), "\n");
// deletion(btree, 7);
// console.log("\nFINAL", JSON.stringify(btree));