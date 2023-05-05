// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


contract Delivery {
    
    enum State { Created, Agreed, Complete, Aborted, Archived, Removed }
    address private contractOwner;
    uint private commission;

    struct Deal{
        uint id;
        uint value;
        uint amount;
        string code;
        address seller;
        address buyer;
        State state;
        string itemId;
        string place;
        string schedule;
        string time;
    }

    mapping (uint => Deal) private deals;
    uint public dealCount;

    constructor() {
        commission = 2;
        dealCount = 0;
        contractOwner = msg.sender;

    }

    function addDeal(string memory _itemId, address _seller, uint _amount, string memory _place, string memory _schedule) payable public {
        uint loc_value = msg.value;
        payable(contractOwner).transfer(loc_value);
        deals[dealCount] = Deal(dealCount,loc_value,_amount,"H",msg.sender,_seller,State.Created,_itemId, _place, _schedule, '');
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

    modifier onlyClient(uint _dealId) {
        if ((msg.sender != deals[_dealId].seller) && (msg.sender != deals[_dealId].buyer))
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
        bytes32 hashcode = keccak256(abi.encodePacked(deals[_dealId].code));
        if (hashcode == keccak256(abi.encodePacked(("H"))) && (hashcode != keccak256(abi.encodePacked(_code))))
            revert InvalidCode();
        _;
    }

    event DeliveryAddedEvent(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event reportAborted(address indexed contractOwner, uint indexed _dealId);
    event PurchaseConfirmed(address indexed _seller, uint indexed _dealId);
    event ItemReceived(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event SellerRefunded(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event RequestPayFromOwner(address indexed contractOwner, uint _dealId, uint _money);
    event DealComplete(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event DealIsCalledOff(address indexed _buyer, address indexed _seller, uint indexed _dealId);
    event ProductIsNotWhatWasPromised(address indexed contractOwner, address indexed _seller, string indexed _itemId, string _complaint);
    event ComissionChangedTo(uint indexed _rate);

    function abort(uint _dealId)
        external
        onlyBuyer(_dealId)
        notInState(_dealId, State.Aborted)
        notInState(_dealId, State.Archived)
        notInState(_dealId, State.Complete)
        notInState(_dealId, State.Removed)
    {
        deals[_dealId].state = State.Aborted;
    }

    function confirmDeal(uint _dealId, string memory _time, string memory _place)
        external
        inState(_dealId, State.Created)
        onlySeller(_dealId)
    {
        string memory code = Strings.toString(genCode());
        deals[_dealId].state = State.Agreed;
        deals[_dealId].code = code;
        deals[_dealId].time = _time;
        deals[_dealId].place = _place;
    }

    function getDealPayCode(uint _dealId) external view
        inState(_dealId, State.Agreed)
        onlySeller(_dealId)
        returns (string memory)
    {
        
        return deals[_dealId].code;
    }

    function deliverySuccessful(uint _dealId, string memory _code)
        external
        onlyBuyer(_dealId)
        inState(_dealId, State.Agreed)
        codeIsCorrect(_code,_dealId)
    {
        emit RequestPayFromOwner(contractOwner,_dealId,  deals[_dealId].value);
        
        deals[_dealId].state = State.Complete;

    }

    function deliveryCalledOff(uint _dealId)
        external
        onlySeller(_dealId)
        notInState(_dealId, State.Created)
        notInState(_dealId, State.Archived)
        notInState(_dealId, State.Aborted)
        notInState(_dealId, State.Removed)
    {
        deals[_dealId].code = "H";
        deals[_dealId].state = State.Created;

    }

    function productIsntWhatWasPromised(uint _dealId, string memory _complaint)
        external
        onlySeller(_dealId)
        inState(_dealId, State.Agreed)
    {
        emit ProductIsNotWhatWasPromised(contractOwner, deals[_dealId].seller, deals[_dealId].itemId, _complaint);
        
        deals[_dealId].state = State.Aborted;

    }

    function giveSellerMoney(uint _dealId)
        external
        onlyOwner
        inState(_dealId, State.Complete)
    {
        payable(deals[_dealId].seller).transfer(deals[_dealId].value * (100 - commission) / 100);
        
        deals[_dealId].state = State.Archived;
    }

    function giveBuyerMoney(uint _dealId)
        external
        onlyOwner
        notInState(_dealId, State.Aborted)
        notInState(_dealId, State.Archived)
        notInState(_dealId, State.Complete)
        notInState(_dealId, State.Removed)
    {
        payable(deals[_dealId].buyer).transfer(deals[_dealId].value);
        deals[_dealId].state = State.Aborted;
    }

    function changeComissionRate(uint _rate)
        external
        onlyOwner()
        returns(bool)
    {
        commission = _rate;
        return true;    
    }

    function changeRendezvous(uint _dealId, string memory _place, string memory _time) external onlySeller(_dealId) returns(bool) {
        deals[_dealId].place = _place;
        deals[_dealId].time = _time;

        return true;
    }

    function getSchedule(uint _dealId) view external onlySeller(_dealId) returns(string memory p) {

        return deals[_dealId].schedule;
    }

    function getPlace(uint _dealId) view external onlyBuyer(_dealId) returns(string memory p) {

        return deals[_dealId].place;
    }

    function getDealState(uint _dealId) view external onlyClient(_dealId) returns(State) {

        return deals[_dealId].state;
    }

    function getDeals() external view returns (Deal[] memory) {
        Deal[]    memory de = new Deal[](dealCount);
        uint index = 0;
        for (uint i = 0; i < dealCount; i++) {
            if ((deals[i].seller == msg.sender) || (deals[i].buyer == msg.sender)) 
            {
                de[index] = deals[i];
                de[index].code = ''; 
            }
        }
        return de;
    }

    function removeDeal(uint _dealId)
        external
        onlySeller(_dealId)
        notInState(_dealId, State.Agreed)
        
    {
        deals[_dealId].state = State.Removed;
    }

    function genCode() private view returns (uint) {
        return (uint(keccak256(abi.encodePacked(block.timestamp,msg.sender))) % 100) * 909 + 10000;
    }
}