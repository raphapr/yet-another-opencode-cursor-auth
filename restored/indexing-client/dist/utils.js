function getAncestorSpline(relativePath) {
  const spline = [];
  // Normalize the path to avoid variants like './a/b' or trailing slashes
  const current = external_node_path_.normalize(relativePath);
  // Start from the parent directory of the file
  let parent = external_node_path_.dirname(current);
  // Always include at least one element (the root will be included as the last item)
  // Keep walking up until we reach the merkle tree root represented by '.'
  // The first item is the immediate parent directory of the file
  // Each subsequent item is the parent of the previous item
  // The last item must be '.' (the merkle tree root)
  // Example: a/b/c.txt -> [ 'a/b', 'a', '.' ]
  // Example: a.txt -> [ '.' ]
  // Note: path.dirname('a') === '.'
  // Build the spline by walking parents and including '.' as terminal
  // Ensure non-empty
  // Loop until we have pushed '.'
  // eslint-disable-next-line no-constant-condition
  while (true) {
    spline.push({
      relativeWorkspacePath: parent,
      hashOfNode: ""
    });
    if (parent === ".") break;
    parent = external_node_path_.dirname(parent);
  }
  return spline;
}