//
// DbiliaToken.sol
// Dbilia
//
// Created by Tony on 2021-06-23
// Copyright © 2021 Dbilia Digital Memorabilia. All Rights Reserved.

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice A Simple Custom Token
contract DbiliaToken is Ownable {
  /// @notice The even triggered when a new token generated through mintWithUSD
  event NewTokenWithUSD(address indexed owner, uint256 tokenId);

  /// @notice The even triggered when a new token generated through mintWithETH
  event NewTokenWithETH(address indexed owner, uint256 tokenId);

  /// @notice Indicates the owner of each individual token
  mapping(uint256 => address) public owners;

  /// @notice Indicates the URI of each individual Token
  mapping(uint256 => string) public uris;

  /// @notice Indicates Card used for payment
  mapping(bytes32 => address) private cards;

  /// @notice The Id of last token
  uint256 private lastTokenId;

  /// @notice Dbilia mints token on the user's behalf
  function mintWithUSD(
    address userId,
    uint256 cardId,
    uint256 edition,
    string memory tokenURI
  ) external onlyOwner {
    require(userId != address(0), "Dbilia: Invalid User Id.");
    uint256 tokenId = _mint(userId, cardId, edition, tokenURI);
    emit NewTokenWithUSD(userId, tokenId);
  }

  /// @notice user mints token
  function mintWithETH(
    uint256 cardId,
    uint256 edition,
    string memory tokenURI
  ) external payable {
    require(msg.value >= (9 wei), "Dbilia: Insufficient ETH to mint.");
    uint256 tokenId = _mint(msg.sender, cardId, edition, tokenURI);
    emit NewTokenWithETH(msg.sender, tokenId);
  }

  /// @notice Gets the owner of given token
  /// @return address - The owner
  function ownerOf(uint256 _tokenId) public view returns (address) {
    return owners[_tokenId];
  }

  /// @notice mint a new token
  /// @return uint - The new token's Id
  function _mint(
    address _owner,
    uint256 _cardId,
    uint256 _edition,
    string memory _tokenURI
  ) private returns (uint256) {
    bytes32 cardKey = _getCardKey(_cardId, _edition);
    require(cards[cardKey] == address(0), "Dbilia: User had used the card already.");

    cards[cardKey] = _owner;

    uint256 tokenId = _generateTokenId();
    owners[tokenId] = _owner;
    uris[tokenId] = _tokenURI;

    return tokenId;
  }

  /// @notice Generates a new unique token Id
  /// @return uint - The new generated token Id
  function _generateTokenId() private returns (uint256) {
    return ++lastTokenId;
  }

  /// @notice Generate hash for card
  /// @return bytes32 - The hash value
  function _getCardKey(uint256 _cardId, uint256 _edition) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_cardId, _edition));
  }
}
