const Oracle = artifacts.require("./USDOracle.sol");

module.exports = function(deployer) {
  deployer.deploy(Oracle);
};
