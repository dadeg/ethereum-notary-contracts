pragma solidity ^0.4.18;

contract NotaryStore {
  Entry[] private store;

  struct Entry {
    address signer;
    string documentHash;
  }

  event FoundEntry(
    address signer,
    string documentHash
  );

  /**
    Returns index of new Entry.
   */
  function create(string documentHash) public returns (uint) {
    return store.push(Entry(msg.sender, documentHash)) - 1;
  }

  function read(uint index) public {
    require(index < store.length);
    FoundEntry(store[index].signer, store[index].documentHash);
  }

  /**
    Finds all the notary signers for a particular hash.
    Creates an event for each of the signers of a hash.
   */
  function findAll(string documentHash) public returns (uint) {
    uint entriesFound = 0;
    for (uint i = 0; i<store.length; i++) {
      if (keccak256(store[i].documentHash) == keccak256(documentHash)) {
        FoundEntry(store[i].signer, store[i].documentHash);
        entriesFound++;
      }
    }
    return entriesFound;
  }

  /**
    Finds all the notary documentHashes for a particular address.
    Creates an event for each of the hashes this address has signed.
   */
  function findAll(address sender) public returns (uint) {
    uint entriesFound = 0;
    for (uint i = 0; i<store.length; i++) {
      if (store[i].signer == sender) {
        FoundEntry(store[i].signer, store[i].documentHash);
        entriesFound++;
      }
    }
    return entriesFound;
  }
}
