const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/knowledge.json', 'utf8'));
data.topics.forEach(t => {
  console.log(`ID: ${t.id} | Title: ${t.title} | Sections: ${t.sections.length}`);
  t.sections.forEach(s => {
    console.log(`  - Section: ${s.title}`);
  });
});
