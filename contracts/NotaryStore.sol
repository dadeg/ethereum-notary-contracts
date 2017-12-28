pragma solidity ^0.4.18;

contract NotaryStore {

  event Entry(
    address signer,
    string documentHash
  );

  /**
    create a new Entry in the logs.
   */
  function create(string documentHash) public returns (bool) {
    Entry(msg.sender, documentHash);
    return true;
  }
}
