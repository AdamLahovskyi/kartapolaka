const fs = require('fs');

try {
  const content = fs.readFileSync('src/data/knowledge.json', 'utf8');

  // The file is a concatenation of multiple JSON objects: { "topics": [...] } { "topics": [...] }
  // We can convert this into a valid JSON array of objects by replacing "}\s*{" with "},{" 
  // and wrapping the whole thing in "[ ... ]"
  
  const fixedContent = '[' + content.replace(/\}\s*\{/g, '},{') + ']';
  
  const parsedArray = JSON.parse(fixedContent);
  
  // Now parsedArray is an array of objects like [{ topics: [...] }, { topics: [...] }]
  // We want to merge all topics into a single array
  
  const allTopics = [];
  parsedArray.forEach(obj => {
    if (obj.topics) {
      allTopics.push(...obj.topics);
    }
  });
  
  const finalJson = { topics: allTopics };
  fs.writeFileSync('src/data/knowledge.json', JSON.stringify(finalJson, null, 2));
  console.log("Successfully merged knowledge.json topics!");

} catch (e) {
  console.error("Error fixing JSON:", e);
}
