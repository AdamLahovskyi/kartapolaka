const fs = require('fs');
try {
  let content = fs.readFileSync('src/data/knowledge.json', 'utf8');

  // Fix the specific broken bracket sequence:
  // ]
  // }
  //     }
  //   ],
  //     {
  content = content.replace(/\]\s*\}\s*\}\s*\]\,\s*\{/g, ']\n}\n},\n{');
  
  // Fix the missing comma sequence:
  // ]
  // }
  // {
  //   "id": ...
  content = content.replace(/\]\s*\}\s*\{/g, ']\n}\n},\n{');
  
  // Also we still need to fix `} {` or similar missing commas
  content = content.replace(/\}\s*(?=\{\s*"id"\s*:)/g, '},');

  // Strip `{"topics":[` and `]}` 
  let cleanContent = content.replace(/\{\s*"topics"\s*:\s*\[/g, '');
  cleanContent = cleanContent.replace(/\]\s*\}\s*$/g, ''); 
  cleanContent = cleanContent.replace(/\]\s*\}\s*(?=\{)/g, '},'); 
  
  cleanContent = '{ "topics": [' + cleanContent + '] }';
  
  // Final cleanup: just in case there are multiple commas like `},,` 
  cleanContent = cleanContent.replace(/\},\s*,/g, ',');
  
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
    console.log("SUCCESS! Fixed and merged.");
  } catch(e) {
    console.error("Parse Error:", e.message);
    const match = e.message.match(/position (\d+)/);
    if(match) {
      const pos = parseInt(match[1], 10);
      console.error("Around error:\n", cleanContent.substring(Math.max(0, pos - 150), pos + 150));
    }
  }
} catch(e) {
  console.error(e);
}
