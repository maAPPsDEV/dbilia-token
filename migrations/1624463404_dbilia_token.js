//
// 1624463404_dbilia_token.js
// Dbilia
//
// Created by Tony on 2021-06-23
// Copyright © 2021 Dbilia Digital Memorabilia. All Rights Reserved.

const DbiliaToken = artifacts.require("DbiliaToken");

module.exports = function (_deployer, _network, [_alice]) {
  // Use deployer to state migration tasks.
  _deployer.deploy(DbiliaToken, { from: _alice });
};
