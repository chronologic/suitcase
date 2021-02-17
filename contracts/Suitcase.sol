pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Sellable.sol";

contract Suitcase is Sellable {
  function transfer(ERC20 asset, address to, uint256 value) public onlyOwner ifNotLocked returns (bool) {
    return asset.transfer(to, value);
  }

  function proxy(address to, bytes memory data) public payable onlyOwner ifNotLocked returns (bool) {
    (bool success, ) = to.call{ value: msg.value }(data);
    return success;
  }
}
