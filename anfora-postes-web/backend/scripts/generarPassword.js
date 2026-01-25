// backend/scripts/generarPassword.js
const bcrypt = require('bcrypt');

const generarPassword = async () => {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n✅ Password hash generado correctamente\n');
  console.log('Password original:', password);
  console.log('\nHash generado:');
  console.log(hash);
  console.log('\n📋 Copia y ejecuta este SQL en pgAdmin:\n');
  console.log(`UPDATE usuarios SET password_hash = '${hash}' WHERE email = 'admin@inventel.com';`);
  console.log('\n');
};

generarPassword();
