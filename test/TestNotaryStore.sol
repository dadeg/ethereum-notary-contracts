pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NotaryStore.sol";

contract TestNotaryStore {
  NotaryStore notaryStore = NotaryStore(DeployedAddresses.NotaryStore());

  string foobarHash = "0a50261ebd1a390fed2bf326f2673c145582a6342d523204973d0219337f81616a8069b012587cf5635f6925f1b56c360230c19b273500ee013e030601bf2425";

  // Testing the adopt() function
  function testUserCanWrite() public {
    Assert.isTrue(notaryStore.create(foobarHash), "creating an entry");
    // TODO: write test that asserts an event was created.
  }

}
