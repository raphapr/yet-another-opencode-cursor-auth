async function buildTreeStructure(dirPath) {
  const entries = await (0, promises_.readdir)(dirPath, {
    withFileTypes: true
  }).catch(() => []);
  const nodes = [];
  for (const entry of entries) {
    const fullPath = external_node_path_.join(dirPath, entry.name);
    const node = {
      name: entry.name,
      path: fullPath,
      isDirectory: entry.isDirectory()
    };
    if (entry.isDirectory()) {
      node.children = await buildTreeStructure(fullPath);
    }
    nodes.push(node);
  }
  return nodes.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });
}
function formatTreeNode(node, prefix = "", isLast = true) {
  const connector = isLast ? "└── " : "├── ";
  const displayName = node.isDirectory ? `${node.name}/` : node.name;
  const lines = [`${prefix}${connector}${displayName}`];
  const children = node.children;
  if (children?.length) {
    const childPrefix = prefix + (isLast ? "    " : "│   ");
    children.forEach((child, index) => {
      const childIsLast = index === children.length - 1;
      lines.push(...formatTreeNode(child, childPrefix, childIsLast));
    });
  }
  return lines;
}
async function generateTreeListingForPath(notesPath) {
  const exists = await (0, promises_.access)(notesPath, promises_.constants.R_OK).then(() => true, () => false);
  if (!exists) {
    return "(No notes directory yet - will be created when you write your first note)";
  }
  const tree = await buildTreeStructure(notesPath);
  if (tree.length === 0) {
    return "(Notes directory is empty)";
  }
  return tree.flatMap((node, index) => formatTreeNode(node, "", index === tree.length - 1)).join("\n");
}
async function generateConversationNotesTreeListing(projectDir, notesSessionId) {
  const notesPath = external_node_path_.join(projectDir, "agent-notes", notesSessionId);
  return generateTreeListingForPath(notesPath);
}
async function generateSharedNotesTreeListing(projectDir) {
  const notesPath = external_node_path_.join(projectDir, "agent-notes", "shared");
  return generateTreeListingForPath(notesPath);
}
//# sourceMappingURL=notes.js.map