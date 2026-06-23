const fs = require('fs');

try {
  const content = fs.readFileSync('src/data/knowledge.json', 'utf8');

  const topics = [];
  
  // Find all instances of `"id":`
  const regex = /\{\s*"id"\s*:\s*"[^"]+"/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    let startIdx = match.index;
    
    // Check if this is a topic by checking if it has "sections" later, before the next topic
    // A better way is to just find the opening `{` and trace brackets.
    let braceCount = 0;
    let endIdx = -1;
    let inString = false;
    let escape = false;

    for (let i = startIdx; i < content.length; i++) {
      const char = content[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i;
            break;
          }
        }
      }
    }

    if (endIdx !== -1) {
      const jsonStr = content.substring(startIdx, endIdx + 1);
      try {
        const topicObj = JSON.parse(jsonStr);
        // Ensure it's actually a topic (has sections) and not a date or person object
        // The topic objects have "title", "icon", "description"
        if (topicObj.title && topicObj.sections) {
          topics.push(topicObj);
        }
      } catch(e) {
        // Might be malformed, or not a full topic
      }
    }
  }

  console.log(`Extracted ${topics.length} valid topics.`);

  // Deduplicate
  const topicsMap = {};
  topics.forEach(t => {
    if (!topicsMap[t.id]) {
      topicsMap[t.id] = { ...t, sections: [...(t.sections || [])] };
    } else {
      topicsMap[t.id].sections.push(...(t.sections || []));
    }
  });

  const finalTopics = Object.values(topicsMap);
  if (finalTopics.length > 0) {
    fs.writeFileSync('src/data/knowledge.json', JSON.stringify({ topics: finalTopics }, null, 2));
    console.log("SUCCESS! Parsed using bracket matching and saved.");
  } else {
    console.error("No topics found!");
  }
} catch(e) {
  console.error(e);
}
