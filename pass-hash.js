const bcrypt = require('bcrypt');

const myPassword = 'Gatos#321#@';

async function hashText(text) {
  const hash = await bcrypt.hash(text, 10);
  // console.log(hash);
  return hash;
}

//const encPassword = hashText(myPassword).then(() => console.log(encPassword));
(async () => {
  console.log(await hashText(myPassword));
})();

console.log(myPassword);
//console.log(encPassword);

hashText(myPassword).then((enc) => console.log(enc));
