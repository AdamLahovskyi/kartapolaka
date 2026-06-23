const fs = require('fs');

try {
  let content = fs.readFileSync('src/data/knowledge.json', 'utf8');

  // Find boundaries like `} {` or `} \n {` and replace with `},{`
  // We'll just wrap the whole thing in an array to parse it safely.
  let fixedContent = content.replace(/\}\s*\{/g, '},{');
  
  // If the user pasted something that has multiple "topics" arrays but without outer brackets,
  // let's try just aggressive replacement of } \n { to make it an array.
  fixedContent = '[' + fixedContent + ']';
  
  try {
    const parsedArray = JSON.parse(fixedContent);
    const allTopics = [];
    
    // Extract everything
    parsedArray.forEach(obj => {
      if (obj.topics) {
        allTopics.push(...obj.topics);
      }
    });

    // Deduplicate topics by ID and merge their sections
    const topicsMap = {};
    allTopics.forEach(t => {
      if (!topicsMap[t.id]) {
        topicsMap[t.id] = { ...t, sections: [...(t.sections || [])] };
      } else {
        topicsMap[t.id].sections.push(...(t.sections || []));
      }
    });

    const finalJson = { topics: Object.values(topicsMap) };
    fs.writeFileSync('src/data/knowledge.json', JSON.stringify(finalJson, null, 2));
    console.log("SUCCESS! JSON fixed and topics merged.");
  } catch (err) {
    console.error("Failed to parse as array of objects. Trying regex approach...");
    
    // Fallback: If it's broken in a weird way, we just replace all `]\n}\n{\n  "topics": [` with `,`
    let altContent = content.replace(/\}\s*\]\s*\}\s*\{\s*"topics"\s*:\s*\[/g, '},');
    
    try {
      const parsed = JSON.parse(altContent);
      
      const topicsMap = {};
      parsed.topics.forEach(t => {
        if (!topicsMap[t.id]) {
          topicsMap[t.id] = { ...t, sections: [...(t.sections || [])] };
        } else {
          topicsMap[t.id].sections.push(...(t.sections || []));
        }
      });
      fs.writeFileSync('src/data/knowledge.json', JSON.stringify({ topics: Object.values(topicsMap) }, null, 2));
      console.log("SUCCESS! JSON fixed using fallback method.");
    } catch (err2) {
      console.error("Fallback method failed too:", err2.message);
    }
  }
} catch (e) {
  console.error(e);
}
