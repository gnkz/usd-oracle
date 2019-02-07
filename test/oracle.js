const Oracle = artifacts.require("USDOracle");

contract("USDOracle", (accounts) => {
  it("should be deployed", async () => {
    const oracle = await Oracle.deployed();

    assert.isNotNull(oracle);
  });

  context("methods", () => {
    let oracle;
  
    beforeEach(async () => {
      oracle = await Oracle.new();
    });
  
    it("should update the rate", async () => {
      const expectedRate = 255;
      await oracle.updateRate(expectedRate);
  
      const rate = await oracle.currentRate();
  
      assert.strictEqual(expectedRate, rate.toNumber());
    });
  
    it("should update the timestamp", async () => {
      const rate = 255;
  
      const { receipt } = await oracle.updateRate(rate);

      const { timestamp } = await web3.eth.getBlock(receipt.blockNumber);
  
      const updatedAt = await oracle.updatedAt();
  
      assert.strictEqual(timestamp, updatedAt.toNumber());
    });

    it("should emit the RateUpdated event", async () => {
      const rate = 255;

      const { receipt } = await oracle.updateRate(rate);
      const { blockNumber, logs } = receipt;
      const { timestamp } = await web3.eth.getBlock(blockNumber);

      assert.strictEqual(1, logs.length);

      const { event, args } = logs[0];

      const eventRate = args._rate;
      const eventUpdatedAt = args._updatedAt;

      assert.strictEqual("RateUpdated", event);
      assert.strictEqual(rate, eventRate.toNumber());
      assert.strictEqual(timestamp, eventUpdatedAt.toNumber());
    });
  });
  
  context("from not owner", () => {
    let oracle;
  
    const owner = accounts[0];
    const notOwner = accounts[1];
  
    beforeEach(async () => {
      oracle = await Oracle.new({ from: owner });
    });
  
    it("should fail to call updateRate", async () => {
      try {
        await oracle.updateRate(1, { from: notOwner });
      } catch(err) {
        assert.match(err, /revert/);
      }
    });
  });
});
