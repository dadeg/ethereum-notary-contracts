pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NotaryStore.sol";

contract TestNotaryStore {
  NotaryStore notaryStore = NotaryStore(DeployedAddresses.NotaryStore());

  string foobarHash = "0a50261ebd1a390fed2bf326f2673c145582a6342d523204973d0219337f81616a8069b012587cf5635f6925f1b56c360230c19b273500ee013e030601bf2425";
  string anotherHash = "1a50261ebd1a390fed2bf326f2673c145582a6342d523204973d0219337f81616a8069b012587cf5635f6925f1b56c360230c19b273500ee013e030601bf2425";

  // Testing the adopt() function
  function testUserCanWrite() public {
    uint index = notaryStore.create(foobarHash);
    Assert.equal(index, 0, "should write and return the array position");
    uint index2 = notaryStore.create(anotherHash);
    Assert.equal(index2, 1, "should write and return the array position");
  }

  // function testRead() public {
  //   // TODO: add test to listen for event
  //   notaryStore.read(0);
  //   notaryStore.read(123); // TODO: figure out how to test for errors.
  // }

  function testFindAllBySigner() public {
    uint result = notaryStore.findAll(this);
    // TODO: add test to listen for event
    Assert.equal(result, 2, "should find 1 result");

    notaryStore.create(anotherHash);
    notaryStore.create(foobarHash);

    uint results = notaryStore.findAll(this);
    // TODO: add test to listen for events
    Assert.equal(results, 4, "should find multiple hashes");
  }

  function testFindAllByHash() public {
    uint result = notaryStore.findAll(anotherHash);
    // TODO: add test to listen for event
    Assert.equal(result, 2, "should find 1 signer");
  }

}
