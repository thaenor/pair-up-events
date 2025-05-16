
#!/usr/bin/env node
const { spawnSync } = require('child_process');

console.log('Running Vitest tests...');
const result = spawnSync('npx', ['vitest', 'run'], { 
  stdio: 'inherit', 
  shell: true 
});

process.exit(result.status);
