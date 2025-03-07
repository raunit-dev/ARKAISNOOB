// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeNFT is ERC1155, Ownable {
    uint256 public badgeIdCounter;

    constructor() ERC1155("ipfs://QmBadgeBaseURI/{id}.json") Ownable(msg.sender) {
        badgeIdCounter = 0;
    }

    function mintBadge(address recipient, uint256 badgeId, uint256 amount) public onlyOwner {
        _mint(recipient, badgeId, amount, "");
        if (badgeId >= badgeIdCounter) {
            badgeIdCounter = badgeId + 1;
        }
    }
}