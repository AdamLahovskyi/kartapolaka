const fs = require('fs');
try {
  let content = fs.readFileSync('src/data/knowledge.json', 'utf8');

  // Fix 1: My bad replacement `}\n    }\n  ],\n    {` back to what it was or just clean it up.
  // Wait, the previous log said the error was at line 1113. So my bad replacement IS FIXED,
  // but there's ANOTHER error: missing comma between `} {`.
  
  // Replace `}` followed by whitespace and `{ "id":` with `}, { "id":`
  content = content.replace(/\}\s*(?=\{\s*"id"\s*:)/g, '},');
  
  // Also, if the entire file starts with `{ "topics": [` and doesn't close it properly, or has multiple,
  // let's just make sure we only have one `topics` array. 
  // Let's strip out `  "topics": [` and the opening/closing braces, and just wrap everything in `[ ... ]`.
  
  // Remove all `{ "topics": [` and `] }` wrappers from the file to get just a list of topic objects
  let cleanContent = content.replace(/\{\s*"topics"\s*:\s*\[/g, '');
  cleanContent = cleanContent.replace(/\]\s*\}\s*$/g, ''); 
  // We might have multiple `] }` in the middle if there were multiple blocks
  cleanContent = cleanContent.replace(/\]\s*\}\s*(?=\{)/g, ','); 
  
  // Ensure we have commas between any remaining adjacent objects `} {`
  cleanContent = cleanContent.replace(/\}\s*\{/g, '},{');
  
  // Wrap in our own single array
  cleanContent = '{ "topics": [' + cleanContent + '] }';
  
  try {
    const data = JSON.parse(cleanContent);
    const topicsMap = {};
    data.topics.forEach(t => {
      if (!topicsMap[t.id]) {
        topicsMap[t.id] = { ...t, sections: [...(t.sections || [])] };
      } else {
        topicsMap[t.id].sections.push(...(t.sections || []));
      }
    });

    const finalJson = { topics: Object.values(topicsMap) };
    fs.writeFileSync('src/data/knowledge.json', JSON.stringify(finalJson, null, 2));
    console.log("SUCCESS! JSON fixed using robust reconstruction.");
  } catch(e) {
    console.error("Parse Error:", e.message);
    const match = e.message.match(/position (\d+)/);
    if(match) {
      const pos = parseInt(match[1], 10);
      console.error("Around error:\n", cleanContent.substring(Math.max(0, pos - 100), pos + 100));
    }
  }
} catch(e) {
  console.error(e);
}
