var Suitcase = artifacts.require("./Suitcase.sol");

module.exports = function(deployer) {
  deployer.deploy(Suitcase);
};
