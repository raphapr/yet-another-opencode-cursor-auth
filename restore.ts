
import { file, write } from "bun";
import { mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { $ } from "bun";

const INPUT_FILE = "cursor-agent-source/index.js";
const OUTPUT_DIR = "restored";

async function main() {
  console.log("Scanning for modules...");
  
  // Use grep to find lines starting with /***/ "path":
  // The output format is line_number:/***/ "path":
  const grepOutput = await $`grep -n '/\*\*\*/ "' ${INPUT_FILE}`.text();
  const lines = grepOutput.trim().split("\n");
  
  console.log(`Found ${lines.length} modules.`);

  // Parse the grep lines to get start lines and paths
  const modules = lines.map(line => {
    const match = line.match(/^(\d+):\/\*\*\*\/ "(.*)":$/);
    if (!match) return null;
    return {
      line: parseInt(match[1], 10),
      path: match[2]
    };
  }).filter(Boolean) as { line: number, path: string }[];

  for (let i = 0; i < modules.length; i++) {
    const current = modules[i];
    const next = modules[i+1];
    
    // Determine start and end lines for extraction
    // The module starts at current.line + 1 (the wrapper function line)
    // And ends before the next module starts.
    // Based on analysis:
    // Line N: /***/ "path":
    // Line N+1: /***/ ((...
    // ...
    // Line M: /***/ }),
    
    // So we want to extract from N+1. 
    // But we need to find where it ends.
    // If there is a next module, the previous one usually ends a few lines before.
    // Let's grab everything from N+1 to (NextN - 1) and then trim the end.
    
    let startLine = current.line + 1;
    let endLine;
    
    if (next) {
      endLine = next.line - 1;
    } else {
        // For the last module
        endLine = current.line + 10000; 
    }

    // Use sed to extract the chunk
    const chunkText = await $`sed -n '${startLine},${endLine}p' ${INPUT_FILE}`.text();
    
    let cleanChunk = chunkText.trim();
    
    // The chunk is likely:
    // /***/ ((module, ...) => {
    // ...
    // /***/ }),
    
    // We want to remove the trailing comma if it exists, so it becomes a valid expression
    // (Comment) ((...)) (Comment)
    
    if (cleanChunk.endsWith(",")) {
        cleanChunk = cleanChunk.substring(0, cleanChunk.length - 1);
    }
    
    // Also remove the explicit "/***/ " prefix if it might cause issues (though it shouldn't)
    // But "/***/" is a comment, so it is ignored by parser.
    // However, let's ensure we don't have weird syntax errors.
    
    try {
        const ast = parse(cleanChunk, {
            sourceType: "script",
            plugins: ["typescript", "jsx"]
        });
        
        // Expecting an ExpressionStatement containing an ArrowFunctionExpression or FunctionExpression
        // The AST should be Program > ExpressionStatement > ArrowFunctionExpression
        
        const statement = ast.program.body[0];
        let functionBody;
        
        if (t.isExpressionStatement(statement)) {
            const expr = statement.expression;
            if (t.isArrowFunctionExpression(expr) || t.isFunctionExpression(expr)) {
                functionBody = expr.body;
            } else if (t.isCallExpression(expr)) {
                 // Sometimes it might be a call if it's wrapped differently
                 // But usually webpack modules are functions.
            }
        }
        
        if (functionBody && t.isBlockStatement(functionBody)) {
            // Generate code from the body
            // We want the content of the block, not the block braces if possible?
            // Actually, a module file is just a list of statements.
            // functionBody.body is an array of statements.
            
            // We can construct a new Program with these statements
            const newProgram = t.program(functionBody.body);
            const output = generate(newProgram).code;
            
            await saveModule(current.path, output);
            console.log(`Restored: ${current.path}`);
        } else {
            console.warn(`Could not find function body for ${current.path}`);
            // Fallback: just save the cleanChunk
            await saveModule(current.path, cleanChunk);
        }
        
    } catch (e) {
        console.error(`Failed to parse ${current.path}: ${e.message}`);
        // console.log("Chunk was:", cleanChunk.slice(0, 100) + "...");
    }
  }
}

async function saveModule(originalPath: string, content: string) {
    // Clean up path
    // Paths are like "../../node_modules/..." or "./src/..."
    // We want to root them in OUTPUT_DIR
    
    let cleanPath = originalPath;
    if (cleanPath.startsWith("../../")) {
        cleanPath = cleanPath.replace(/^(\.\.\/)+/, "");
    } else if (cleanPath.startsWith("./")) {
        cleanPath = cleanPath.substring(2);
    }
    
    const fullPath = join(OUTPUT_DIR, cleanPath);
    await mkdir(dirname(fullPath), { recursive: true });
    await write(fullPath, content);
}

main();
