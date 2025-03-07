// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter;

    constructor() ERC721("EduCertify", "CERT") Ownable(msg.sender) {
        tokenIdCounter = 0;
    }

    function mintCertificate(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        tokenIdCounter++;
        uint256 newTokenId = tokenIdCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        return newTokenId;
    }
}
