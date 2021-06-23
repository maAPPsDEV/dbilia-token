//
// dbilia_token.js
// Dbilia
//
// Created by Tony on 2021-06-23
// Copyright © 2021 Dbilia Digital Memorabilia. All Rights Reserved.

const DbiliaToken = artifacts.require("DbiliaToken");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const utils = require("./helpers/utils");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("DbiliaToken", function ([alice, bob, charley]) {
  let dbilia;

  beforeEach(async function () {
    dbilia = await DbiliaToken.new({ from: alice });
  });

  context("mintWithUSD", function () {
    it("should be called by only owner", async function () {
      expect(await dbilia.owner()).to.be.equal(alice);
      const result = await dbilia.mintWithUSD(charley, 1, 1, "token-1", { from: alice });
      expect(result.receipt.status).to.be.equal(true);
      await utils.shouldThrow(dbilia.mintWithUSD(charley, 2, 2, "token-2", { from: bob }));
    });

    it("should not mint for invalid user", async function () {
      await utils.shouldThrow(dbilia.mintWithUSD(web3.utils.padRight(0, 40), 1, 1, "token-1", { from: alice }));
    });

    it("should mint", async function () {
      const result = await dbilia.mintWithUSD(charley, 1, 1, "token-1", { from: alice });
      expect(result.receipt.status).to.be.equal(true);
      expect(result.logs[0].args.owner).to.be.equal(charley);
      const tokenId = result.logs[0].args.tokenId;
      expect(await dbilia.ownerOf(tokenId)).to.be.equal(charley);
    });

    it("should not be able to mint with same card", async function () {
      await dbilia.mintWithUSD(charley, 1, 1, "token-1", { from: alice });
      await utils.shouldThrow(dbilia.mintWithUSD(charley, 1, 1, "token-2", { from: alice }));
      let result = await dbilia.mintWithUSD(charley, 2, 1, "token-2", { from: alice });
      expect(result.receipt.status).to.be.equal(true);
      result = await dbilia.mintWithUSD(charley, 2, 2, "token-3", { from: alice });
      expect(result.receipt.status).to.be.equal(true);
      expect(result.logs[0].args.owner).to.be.equal(charley);
      const tokenId = result.logs[0].args.tokenId;
      expect(await dbilia.ownerOf(tokenId)).to.be.equal(charley);
    });
  });

  context("mintWithETH", function () {
    it("should require sufficient ETH", async function () {
      await utils.shouldThrow(dbilia.mintWithETH(1, 1, "token-1", { from: bob, value: web3.utils.toWei("1", "wei") }));
    });

    it("should mint", async function () {
      const result = await dbilia.mintWithETH(1, 1, "token-1", { from: bob, value: web3.utils.toWei("9", "wei") });
      expect(result.receipt.status).to.be.equal(true);
      expect(result.logs[0].args.owner).to.be.equal(bob);
      const tokenId = result.logs[0].args.tokenId;
      expect(await dbilia.ownerOf(tokenId)).to.be.equal(bob);
    });

    it("should not be able to mint with same card", async function () {
      await dbilia.mintWithETH(1, 1, "token-1", { from: bob, value: web3.utils.toWei("9", "wei") });
      await utils.shouldThrow(dbilia.mintWithETH(1, 1, "token-2", { from: bob, value: web3.utils.toWei("9", "wei") }));
      let result = await dbilia.mintWithETH(2, 1, "token-2", { from: bob, value: web3.utils.toWei("9", "wei") });
      expect(result.receipt.status).to.be.equal(true);
      result = await dbilia.mintWithETH(2, 2, "token-3", { from: bob, value: web3.utils.toWei("9", "wei") });
      expect(result.receipt.status).to.be.equal(true);
      expect(result.logs[0].args.owner).to.be.equal(bob);
      const tokenId = result.logs[0].args.tokenId;
      expect(await dbilia.ownerOf(tokenId)).to.be.equal(bob);
    });
  });
});
