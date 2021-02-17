pragma solidity 0.7.6;

/**
 * @author Pablo Ruiz <me@pabloruiz.co>
 * @author Marcin Żółkiewski <marcin@chronologic.network>
 * @title Sellable
 */

/**
 * @dev Sellable contract should be inherited by any other contract that
 * wants to provide a mechanism for selling its ownership to another account
 */
abstract contract Sellable {
  address public owner;

  // Current sale status
  bool public selling = false;

  // Who is the selected buyer, if any.
  // Optional
  address public sellingTo;

  // How much ether (wei) the seller has asked the buyer to send
  uint public askingPrice;

  //
  // Modifiers
  //

  /**
  * @dev Throws if called by any account other than the owner.
  */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // Add to functions that the owner wants to prevent being called while the
  // contract is for sale.
  modifier ifNotLocked {
    require(!selling);
    _;
  }

  event Transfer(uint _saleDate, address _from, address _to, uint _salePrice);

  constructor() {
    owner = msg.sender;
    emit Transfer(block.timestamp, address(0), owner, 0);
  }

  /**
    * @dev initiateSale is called by the owner of the contract to start
    * the sale process.
    * @param _price is the asking price for the sale
    * @param _to (OPTIONAL) is the address of the person that the owner
    * wants to sell the contract to. If set to 0x0, anyone can buy it.
    */
  function initiateSale(uint _price, address _to) onlyOwner ifNotLocked public{
    require(_to != address(this) && _to != owner);

    selling = true;

    // Set the target buyer, if specified.
    sellingTo = _to;

    askingPrice = _price;
  }

  /**
    * @dev cancelSale allows the owner to cancel the sale before someone buys
    * the contract.
    */
  function cancelSale() onlyOwner public{
    require(selling);

    // Reset sale variables
    resetSale();
  }

  /**
    * @dev completeSale is called buy the specified buyer
    * (or anyone if sellingTo was not set)
    * to make the purchase.
    * Value sent must match the asking price.
    */
  function completeSale() public payable {
    require(selling);
    require(msg.sender != owner);
    require(msg.sender == sellingTo || sellingTo == address(0));
    require(msg.value == askingPrice);

    // Swap ownership
    address payable prevOwner = payable(owner);
    address newOwner = msg.sender;
    uint salePrice = askingPrice;

    owner = newOwner;

    // Transaction cleanup
    resetSale();

    prevOwner.transfer(salePrice);

    emit Transfer(block.timestamp, prevOwner, newOwner, salePrice);
  }

  //
  // Internal functions
  //

  /**
    * @dev resets the variables related to a sale process
    */
  function resetSale() internal{
    selling = false;
    sellingTo = address(0);
    askingPrice = 0;
  }
}
