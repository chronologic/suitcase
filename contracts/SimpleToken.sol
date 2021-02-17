pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ERC20("SimpleToken", "SIMPLE") {
  constructor() {
    _mint(msg.sender, 10_000_000 * (10 ** 18));
  }
}
