// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract storeUsers {
    address public contractOwner;
    string private salt;
    string public publicVaultHash;

    constructor(string memory _salt) {
        contractOwner = msg.sender;
        salt = _salt;
    }

    mapping(uint => User) public users;

    enum Reputation { BadActor, None, OneDeal, FewDeals, Established }

    struct User {
        address userAddress;
        string vaultHash;
        Reputation reputation;
        uint dealCounter;
    }


    function storeUser(string memory _vaultHash) external returns(bool) {

        users[convertAdrToId(msg.sender)] = User(msg.sender, _vaultHash,Reputation.None, 0);
        return true;
        
    }

    function changeVaultHash(string memory _vaultHash) external returns(bool) {

        users[convertAdrToId(msg.sender)].vaultHash = _vaultHash;
        return true;
    }

    function getHash() view external returns (string memory) {

        return users[convertAdrToId(msg.sender)].vaultHash;
    }

    function isStored() view external returns (bool) {
        if (users[convertAdrToId(msg.sender)].userAddress == msg.sender) {
                return true;
        }
        else {
            return false;
        }
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

    modifier updateReputation(address _adr) {
        uint locCounter = users[convertAdrToId(_adr)].dealCounter;

            if (users[convertAdrToId(_adr)].reputation == Reputation.BadActor) {
                revert();
            } else if (locCounter > 10) {
                users[convertAdrToId(_adr)].reputation = Reputation.Established;
            } else if (locCounter > 2) {
                users[convertAdrToId(_adr)].reputation = Reputation.FewDeals;
            } else if (locCounter == 1) {
                users[convertAdrToId(_adr)].reputation = Reputation.OneDeal;
            } else {
                revert();
            }
            _;
    }

    function getReputation(address _adr) external updateReputation(_adr) returns (uint) {
        Reputation locRep = users[convertAdrToId(_adr)].reputation;

        if (locRep == Reputation.None) {
                return uint(0);
            } else if (locRep == Reputation.OneDeal) {
                return uint(1);
            } else if (locRep == Reputation.FewDeals) {
                return uint(2);
            } else if (locRep == Reputation.Established) {
                return uint(3);
            } else {
                return uint(4);
            }
    }

    function convictABadActor(address _adr) external onlyOwner() userDoesntHaveStatus(_adr, Reputation.BadActor) userDoesntHaveStatus(_adr, Reputation.Established) {
        users[convertAdrToId(_adr)].reputation = Reputation.BadActor;

        emit BadActorPunished(_adr);
    }

    function destroyReputation(address _adr) external onlyOwner() userHasStatus(_adr, Reputation.Established) {
        users[convertAdrToId(_adr)].reputation = Reputation.None;

        emit BadActorPunished(_adr);
    }

    function changePublicVaultHash(string memory _vaultHash) external returns(bool) {

        publicVaultHash = _vaultHash;
        return true;
    }

    function convertAdrToId(address _adr) view private returns (uint) {
        return uint(keccak256(abi.encodePacked(_adr, salt)));
    }
}
