// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


contract Delivery {
    
    enum State { Created, Agreed, Complete, Aborted, Archived }
    address private contractOwner;
    uint private commission;

    struct Deal{
        uint id;
        uint value;
        string code;
        address seller;
        address buyer;
        State state;
        string itemId;
    }

    mapping (uint => Deal) public deals;
    uint public dealCount;

    constructor() {
        commission = 2;
        dealCount = 0;
        contractOwner = msg.sender;

    }

    function addDeal(string memory _itemId, address _seller) payable public {
        uint loc_value = msg.value;
        payable(contractOwner).transfer(loc_value);
        deals[dealCount] = Deal(dealCount,loc_value,"",msg.sender,_seller,State.Created,_itemId);
        emit DeliveryAddedEvent(msg.sender, _seller, dealCount);
        dealCount++;
    }

    modifier condition(bool condition_) {
        require(condition_);
        _;
    }

    error OnlyBuyer();
    error OnlySeller();
    error OnlyOwner();
    error InvalidState();
    error InvalidCode();

    modifier onlyBuyer(uint _dealId) {
        if (msg.sender != deals[_dealId].buyer)
            revert OnlyBuyer();
        _;
    }

    modifier onlySeller(uint _dealId) {
        if (msg.sender != deals[_dealId].seller)
            revert OnlySeller();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != contractOwner)
            revert OnlyOwner();
        _;
    }

    modifier notInState(uint _dealId, State state_) {
        if (deals[_dealId].state == state_)
            revert InvalidState();
        _;
    }

    modifier inState(uint _dealId, State state_) {
        if (deals[_dealId].state != state_)
            revert InvalidState();
        _;
    }

    modifier codeIsCorrect(string memory _code, uint _dealId) {
        if (keccak256(abi.encodePacked(deals[_dealId].code)) != keccak256(abi.encodePacked(_code)))
            revert InvalidCode();
        _;
    }

    event DeliveryAddedEvent(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event reportAborted(address indexed contractOwner, uint indexed _dealId);
    event PurchaseConfirmed(address indexed _seller, uint indexed _dealId, string code);
    event ItemReceived(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event SellerRefunded(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event RequestPayFromOwner(address indexed contractOwner, uint _dealId);
    event DealComplete(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event DealIsCalledOff(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event ProductIsNotWhatWasPromised(address indexed contractOwner, address indexed _seller, string indexed _itemId);
    event ComissionChangedTo(uint indexed _rate);

    function abort(uint _dealId)
        external
        onlyBuyer(_dealId)
        notInState(_dealId, State.Aborted)
        notInState(_dealId, State.Archived)
        notInState(_dealId, State.Complete)
    {
        emit reportAborted(contractOwner,_dealId);
    }

    function confirmDeal(uint _dealId)
        external
        inState(_dealId, State.Created)
        onlySeller(_dealId)
    {
        string memory code = Strings.toString(genCode());
        emit PurchaseConfirmed(deals[_dealId].seller,_dealId, code);
        deals[_dealId].state = State.Agreed;
    }


    function deliverySuccessful(uint _dealId, string memory _code)
        external
        onlyBuyer(_dealId)
        inState(_dealId, State.Agreed)
        codeIsCorrect(_code,_dealId)
    {
        emit RequestPayFromOwner(contractOwner,_dealId);

        emit ItemReceived(deals[_dealId].buyer,deals[_dealId].seller,_dealId);
        
        deals[_dealId].state = State.Complete;

    }

    function deliveryCalledOff(uint _dealId)
        external
        onlySeller(_dealId)
        notInState(_dealId, State.Created)
        notInState(_dealId, State.Archived)
        notInState(_dealId, State.Aborted)
    {
        emit DealIsCalledOff(deals[_dealId].buyer, deals[_dealId].seller, _dealId);
        
        deals[_dealId].state = State.Created;

    }

    function productIsntWhatWasPromised(uint _dealId)
        external
        onlySeller(_dealId)
        inState(_dealId, State.Agreed)
    {
        emit ProductIsNotWhatWasPromised(contractOwner, deals[_dealId].seller, deals[_dealId].itemId);
        
        deals[_dealId].state = State.Created;

    }

    function giveSellerMoney(uint _dealId)
        external
        onlyOwner
        inState(_dealId, State.Complete)
    {
        payable(deals[_dealId].seller).transfer(deals[_dealId].value * (100 - commission) / 100);
        emit DealComplete(deals[_dealId].buyer,deals[_dealId].seller,_dealId);
        
        deals[_dealId].state = State.Archived;
    }

    function giveBuyerMoney(uint _dealId)
        external
        onlyOwner
        notInState(_dealId, State.Aborted)
        notInState(_dealId, State.Archived)
        notInState(_dealId, State.Complete)
    {
        payable(deals[_dealId].buyer).transfer(deals[_dealId].value);
        deals[_dealId].state = State.Aborted;
    }

    function changeComissionRate(uint _rate)
        external
        onlyOwner()
    {
        commission = _rate;
        emit ComissionChangedTo(_rate);       
    }

    function genCode() private view returns (uint) {
        return (uint(keccak256(abi.encodePacked(block.timestamp,msg.sender))) % 100) * 909 + 10000;
    }
}