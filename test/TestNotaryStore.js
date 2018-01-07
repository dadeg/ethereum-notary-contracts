var NotaryStore = artifacts.require("NotaryStore");
var foobarHash = "0xe9f8359b50160d2bb63284ced2bf873b357e4e21d25a7d3f56f3768ad12abd54";
var oneFinney = 1000000000000000;

// taken from OpenZeppelin for now.
async function expectThrow(promise) {
  try {
    await promise;
  } catch (error) {
    const revert = error.message.search('revert') >= 1;
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      'Expected throw, got \'' + error + '\' instead',
    );
    return;
  }
  assert.fail('Expected throw not received');
};

contract('NotaryStore', function (accounts) {
  it("should create an event with the hash and the sender", function () {
    var contractInstance;

    return NotaryStore.deployed().then(function (instance) {
      contractInstance = instance;
      return instance.create(foobarHash, {value: oneFinney});
    }).then(function (tx) {
      assert.equal(tx.logs[0].event, "Entry");
      assert.equal(tx.logs[0].args.documentHash, foobarHash);
      assert.equal(tx.logs[0].args.signer, accounts[0]);
    });
  });

  it("should fail to create if no payment is sent", function () {
    return NotaryStore.deployed().then(function (instance) {
      return expectThrow(instance.create(foobarHash));
    });
  });

  it("should return the cost", function () {
    return NotaryStore.deployed().then(function (instance) {
      return instance.cost.call();
    }).then(function (cost) {
      assert.equal(cost.toNumber(), oneFinney);
    });
  });

  it("should set the cost", function () {
    var contractInstance;
    var twoFinneys = oneFinney * 2;

    return NotaryStore.deployed().then(function (instance) {
      contractInstance = instance;
      return instance.setCost(twoFinneys);
    }).then(function () {
      return contractInstance.cost.call();
    }).then(function (cost) {
      assert.equal(cost, twoFinneys);
    });
  });

  it("should only set the cost if caller is owner", function () {
    var twoFinneys = oneFinney * 2;

    return NotaryStore.deployed().then(function (instance) {
      return expectThrow(instance.setCost(twoFinneys, {from: accounts[1]}));
    });
  });

  it("should return the owner", function () {
    return NotaryStore.deployed().then(function (instance) {
      return instance.owner.call();
    }).then(function (owner) {
      assert.equal(owner, accounts[0]);
    });
  });

  it("should set the owner", function () {
    var contractInstance;

    return NotaryStore.deployed().then(function (instance) {
      contractInstance = instance;
      return instance.setOwner(accounts[1]);
    }).then(function () {
      return contractInstance.owner.call();
    }).then(function (owner) {
      assert.equal(owner, accounts[1]);
    });
  });

  it("should set the owner only if caller is owner", function () {
    // The owner is actually accounts[1] at this point because we set it in the test above.
    // TODO: isolate these tests somehow.
    return NotaryStore.deployed().then(function (instance) {
      return expectThrow(instance.setOwner(accounts[0], { from: accounts[0] }));
    });
  });

  it("should allow withdrawal", function () {
    // The owner is actually accounts[1] at this point because we set it in the test above.
    var ownerStartingBalance = web3.eth.getBalance(accounts[1]);
    var contractStartingBalance;
    var contractInstance;

    return NotaryStore.deployed().then(function (instance) {
      contractInstance = instance;
      contractStartingBalance = web3.eth.getBalance(instance.address);
      return contractInstance.withdraw({ from: accounts[1] });
    }).then(function (tx) {
      var gasUsed = tx.receipt.gasUsed * 100000000000;
      var ownerEndingBalance = ownerStartingBalance.plus(contractStartingBalance).minus(gasUsed);

      assert.equal(web3.eth.getBalance(accounts[1]).toNumber(), ownerEndingBalance.toNumber(), "Amount was not sent to owner");
      assert.equal(web3.eth.getBalance(contractInstance.address).toNumber(), 0, "Amount was not withdrawn from contract");
    });
  });

  it("should allow withdrawal only from owner", function () {
    // The owner is actually accounts[1] at this point because we set it in the test above.
    return NotaryStore.deployed().then(function (instance) {
      return expectThrow(instance.withdraw({ from: accounts[0] }));
    });
  });
});
