const fs = require('fs');
try {
  let content = fs.readFileSync('src/data/knowledge.json', 'utf8');

  // The broken boundary looks like:
  // ]
  // }
  //     }
  //   ],
  //     {
  //       "id": "..."
  
  // Let's replace the broken structure:
  // } (closes a section)
  // ] (closes sections array)
  // } (closes topic)
  //     } (extra bracket I added)
  //   ], (extra brackets I added)
  //     { (starts next topic)

  content = content.replace(/\}\s*\]\s*\}\s*\}\s*\]\,\s*\{/g, '}\n]\n},\n{');
  
  // Let's check if it parses
  try {
    const data = JSON.parse(content);
    
    // We should also deduplicate topics
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
    console.log("SUCCESS! Fixed the broken boundaries and merged topics.");
  } catch(e) {
    console.error("Still invalid JSON. Error:", e.message);
    
    // Let's print the lines around the error
    const match = e.message.match(/position (\d+)/);
    if(match) {
      const pos = parseInt(match[1], 10);
      console.error(content.substring(Math.max(0, pos - 100), pos + 100));
    }
  }
} catch(e) {
  console.error(e);
}
