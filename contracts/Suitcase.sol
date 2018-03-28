pragma solidity ^0.4.19;

import "../installed_contracts/zeppelin/contracts/ownership/Ownable.sol";
import "../installed_contracts/zeppelin/contracts/token/ERC20Basic.sol";
import "./Sellable.sol";

contract Suitcase is Ownable, Sellable {
  function transfer(ERC20Basic asset, address to, uint256 value) public onlyOwner ifNotLocked returns (bool) {
      return asset.transfer(to, value);
  }

  function proxy(address to, bytes data) public payable onlyOwner ifNotLocked returns (bool) {
      return to.call.value(msg.value)(data);
  }
}