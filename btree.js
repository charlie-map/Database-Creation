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
		let return_values = partition(array, payload, low, high);
		array = return_values[0];
		payload = return_values[1];
		quicksort(array, payload, low, return_values[2] - 1); // low side
		quicksort(array, payload, return_values[2] + 1, high); // high side
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
	return [array, payload, lowest + 1];
}

function insert(b_tree, key, value, depth) {
	// Need to run through the tree and decide where we need to put the value
	// Compare key to the keys in the current list of that node
	let key_pos = 0; // Where the key will eventually be going
	for (bkey in b_tree.key) {
		if (key > b_tree.key[bkey]) {
			key_pos++;
		}
	}
	if (b_tree.key.length < m - 1 || b_tree.children.length) { // Need to first check if there's any children positions
		if (typeof b_tree.children[key_pos] == 'undefined') { // Want to insert that node directly into that position
			b_tree.key.push(key);
			b_tree.payload.push(value);
			quicksort(b_tree.key, b_tree.payload, 0, b_tree.key.length - 1);
			return;
		} else { // Continue searching for that ones position
			insert(b_tree.children[key_pos], key, value, depth + 1);
		}
	} else { // When there is one item there, we want to see if there's a child we can move to
		b_tree.key.push(key);
		b_tree.payload.push(value);
		quicksort(b_tree.key, b_tree.payload, 0, b_tree.key.length - 1);
		// if the new length is equal to m (the max), we need to push all the nodes (besides median) down
		if (b_tree.key.length == m) {
			function parent_nodes(current_b_tree, curr_depth) { // Must run through all the parents for a check
				// grab the children that are affected
				// grab the median key, the left keys (new left node), and the right keys (new right node)
				let position_keys = Math.floor(m / 2);
				let parent_key = current_b_tree.key[position_keys];
				let parent_value = current_b_tree.payload[position_keys];
				let left_keys = current_b_tree.key.slice(0, position_keys);
				let right_keys = current_b_tree.key.slice(position_keys + 1);
				let left_values = current_b_tree.payload.slice(0, position_keys);
				let right_values = current_b_tree.payload.slice(position_keys + 1);
				let left_children = [];
				let right_children = [];
				current_b_tree.children.forEach((item, index) => {
					if (index <= position_keys) {
						left_children.push(current_b_tree.children[index]);
					} else {
						right_children.push(current_b_tree.children[index]);
					}
				});
				//with parent keys and left keys and children, then need to grab the parent of this node
				// check the parent key - if it's null, we've reached base case
				let parent_tree = find_parent_object(btree, parent_key, curr_depth, 0);
				if (!parent_tree || parent_tree == current_b_tree) {
					current_b_tree.key = [parent_key];
					current_b_tree.payload = [parent_value];
					current_b_tree.children = [{
						key: left_keys,
						payload: left_values,
						children: left_children
					}, {
						key: right_keys,
						payload: right_values,
						children: right_children
					}];
					return current_b_tree;
				} else {
					parent_tree.key.push(parent_key);
					parent_tree.payload.push(parent_value);
					quicksort(parent_tree.key, parent_tree.payload, 0, parent_tree.key.length - 1);
					// Then need to figure out where to add the children
					let pkey_pos = 0;
					for (pkey in parent_tree.key) {
						if (parent_key == parent_tree.key[pkey]) {
							pkey_pos = pkey;
							break;
						}
					}
					pkey_pos = parseInt(pkey_pos, 10);
					parent_tree.children[pkey_pos] = {
						key: left_keys,
						payload: left_values,
						children: left_children
					};
					parent_tree.children[pkey_pos + 1] = {
						key: right_keys,
						payload: right_values,
						children: right_children
					};
					// Depending on if the parent has issues, need to keep working back up the tree for checks
					if (parent_tree.key.length == m) { // Need to continue running through parents 
						parent_nodes(parent_tree, depth - 1);
					} else {
						return parent_tree;
					}
				}
			}
			return parent_nodes(b_tree, depth);
		}
	}
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

//insert(btree, 0, 816, 0);
insert(btree, 1, 420, 0);
insert(btree, 2, 360, 0);
insert(btree, 3, 69, 0);
insert(btree, 4, 816, 0);
insert(btree, 5, 30, 0);
insert(btree, 6, 4000, 0);
insert(btree, 7, 21, 0);

console.log(JSON.stringify(btree));

if (process.argv[2] == "search") console.log(search(btree, process.argv[3]));
if (process.argv[2] == "insert") {
	insert(btree, parseInt(process.argv[3], 10), process.argv[4], 0);
	console.log(JSON.stringify(btree));
}

function deletion(b_tree, key, depth) {
	let return_value;
	let key_pos = -1;
	for (let bkey = 0; bkey < b_tree.key.length; bkey++) { // See if there's a key within the tree that matches the key
		if (key == b_tree.key[bkey]) { // When key_pos != -1, we need to remove something
			key_pos = bkey;
			break;
		} else if (key > b_tree.key[bkey]) {
			key_pos = bkey + 1;
		}
		key_pos = b_tree.key.length - 1 == bkey && key_pos == -1 ? 0 : key_pos;
	}
	console.log(b_tree.children, key, key_pos);
	if (b_tree.key[key_pos] != key || b_tree.children[key_pos].children.length) {
		if (b_tree.children.length == 0) {
			if (b_tree.key[key_pos] == key) {
				b_tree.key.splice(key_pos, 1);
				b_tree.payload.splice(key_pos, 1);
				return "Single root";
			}
			return "No value under the specified key";
		}
		let inner_key = (depth == 0 && b_tree.key[key_pos] == key) ? key - 1 : key;
		return_value = deletion(b_tree.children[key_pos], inner_key, depth + 1);
	} else {
		if (b_tree.children.length) { // Pull up a child
			return_value = [0];
			b_tree.key[key_pos] = b_tree.children[key_pos].key[b_tree.children[key_pos].key.length - 1];
			b_tree.payload[key_pos] = b_tree.children[key_pos].payload[b_tree.children[key_pos].payload.length - 1];
			b_tree.children[key_pos].key.splice(b_tree.children[key_pos].key.length - 1, 1);
			b_tree.children[key_pos].payload.splice(b_tree.children[key_pos].payload.length - 1, 1);
		} else {
			let key_value = b_tree.key.splice(key_pos, 1)[0];
			let payload_value = b_tree.payload.splice(key_pos, 1)[0];
			return [key_value, payload_value];
		}
	}
	if (key_pos == b_tree.key.length) key_pos--;
	// Need to fix issues with the tree
	// Look at the children, check the cases
	if (b_tree.children[key_pos].key.length && b_tree.children[key_pos + 1].key.length) return return_value; // nothing needs changing
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
	// FINAL CASE: if depth is 0, need to check for if the root is empty
	if (depth == 0 && !b_tree.key.length) {
		if (return_value[0] == "No value under the specified key") return return_value[0];
		b_tree.children[0].key[key_pos] = (return_value[0] && return_value[1]) ? return_value[0] : b_tree.children[0].key[key_pos];
		b_tree.children[0].payload[key_pos] = (return_value[0] && return_value[1]) ? return_value[1] : b_tree.children[0].payload[key_pos];
		b_tree.key = b_tree.children[0].key
		b_tree.payload = b_tree.children[0].payload;
		b_tree.children = b_tree.children[0].children;
	}
	return return_value;
}

// deletion(btree, 15, 0);
// console.log("\nCURRENT", JSON.stringify(btree), "\n");
deletion(btree, 6, 0);
console.log("\n", JSON.stringify(btree), "\n");
// deletion(btree, 10, 0);
// console.log("\nFINAL", JSON.stringify(btree));