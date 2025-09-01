// Run this script with: node hash_staff_password.js
// It will hash a plain text password and print the SQL to update your staff table.

const bcrypt = require('bcryptjs');

const email = 'your_staff_email@example.com'; // CHANGE THIS
const plainPassword = 'yourpassword'; // CHANGE THIS

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('\n--- SQL to run in MySQL ---');
  console.log(`UPDATE staff SET password = '${hash}' WHERE email = '${email}';`);
  console.log('--------------------------\n');
  console.log('Copy and run the above SQL in your MySQL client.');
});
