const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('\n========================================');
console.log('Password:', password);
console.log('========================================');
console.log('\nCopy SQL hii na ui-run kwenye MySQL Workbench:\n');
console.log(`USE portfolio_db;`);
console.log(`INSERT INTO users (username, email, password) VALUES ('admin', 'ramadhani123ally@gmail.com', '${hash}');`);
console.log('\n========================================\n');