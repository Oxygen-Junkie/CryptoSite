// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract storeUsers {
    address private contractOwner;
    string private salt;

    constructor(string memory _salt) {
        contractOwner = msg.sender;
        salt = _salt;
    }

    mapping(uint => User) public users;

    enum Reputation { BadActor, None, OneDeal, FewDeals, Established }

    struct User {
        address userAddress;
        string identity;
        Reputation reputation;
        string dealCounter;
    }


    function storeUser(string memory _identity) external checkDuplicate() {

        users[convertAdrToId(msg.sender)] = User(msg.sender, _identity,Reputation.None, 0);

        emit UserStored();
    }

    function getKey() external returns (string calldata) {

        return users[convertAdrToId(msg.sender)].identity;
    }

    event UserStored();
    event BadActorPunished(address indexed _adr);

    error OnlyOwner();
    error RespectableUser();
    error AlreadyStored();
    error ReputationDoesntAllow();

    modifier checkDuplicate() {
        if (users[convertAdrToId(msg.sender)].userAddress == msg.sender)
            revert AlreadyStored();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != contractOwner)
            revert OnlyOwner();
        _;
    }

    modifier userHasStatus(address _adr, Reputation rep_) {
        if (users[convertAdrToId(_adr)].reputation != rep_)
            revert ReputationDoesntAllow();
        _;
    }

    modifier userDoesntHaveStatus(address _adr, Reputation rep_) {
        if (users[convertAdrToId(_adr)].reputation == rep_)
            revert ReputationDoesntAllow();
        _;
    }

    modifier updateReputation() {
        User memory locCounter = users[convertAdrToId(msg.sender)];

            if (users[convertAdrToId(msg.sender)].reputation == Reputation.BadActor) {
                revert();
            } else if (locCounter > 10) {
                users[convertAdrToId(msg.sender)].reputation = Reputation.Established;
            } else if (locCounter > 2) {
                users[convertAdrToId(msg.sender)].reputation = Reputation.FewDeals;
            } else if (locCounter == 1) {
                users[convertAdrToId(msg.sender)].reputation = Reputation.OneDeal;
            } else {
                revert();
            }
            _;
    }

    function getReputation() external updateReputation() {
        Reputation locRep = users[convertAdrToId(msg.sender)].reputation;

        if (locRep == Reputation.None) {
                return uint(0);
            } else if (locRep == Reputation.OneDeal) {
                return uint(1);
            } else if (locRep == Reputation.FewDeals) {
                return uint(2);
            } else if (locRep == Reputation.Established) {
                return uint(3);
            } else {
                return uint(-1);
            }
    }

    function convictABadActor(address _adr) external onlyOwner() userDoesntHaveStatus(_adr, Reputation.BadActor) userDoesntHaveStatus(_adr, Reputation.Established) {
        users[_adr].reputation = Reputation.BadActor;

        emit BadActorPunished(_adr);
    }

    function destroyReputation(address _adr) external onlyOwner() userHasStatus(_adr, Reputation.Established) {
        users[_adr].reputation = Reputation.None;

        emit BadActorPunished(_adr);
    }

    function convertAdrToId(address _adr) private returns (uint) {
        return uint(keccak256(_adr, salt));
    }
}
