pragma solidity ^0.4.18;

contract NotaryStore {

  event Entry(
    address indexed signer,
    bytes32 indexed documentHash
  );

  /**
    create a new Entry in the logs.
   */
  function create(bytes32 documentHash) public returns (bool) {
    Entry(msg.sender, documentHash);
    return true;
  }
}
