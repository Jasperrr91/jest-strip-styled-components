const { __PRIVATE__ } = require('styled-components');

if (!__PRIVATE__) {
  throw new Error('Could not find styled-components secret internals');
}

const { mainSheet, masterSheet } = __PRIVATE__;
const sheet = mainSheet || masterSheet;

const getHashes = () => {
  const hashes = new Set();

  for (const [mainHash, childHashSet] of sheet.names) {
    hashes.add(mainHash);

    for (const childHash of childHashSet) hashes.add(childHash);
  }

  return Array.from(hashes);
};

module.exports = {
  getHashes,
};
