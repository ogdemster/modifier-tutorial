const mocha = require("mocha");
// const assert = require("assert");
const chai = require("chai");
const { expect } = chai;
const { solidity } = require("ethereum-waffle");
const { ethers } = require("hardhat");

describe("Modifier Tutorial", function () {
  let ModifierTutorial;
  let modifierTutorial;
  let owner;

  beforeEach(async function () {
    ModifierTutorial = await ethers.getContractFactory("ModifierTutorial");
    modifierTutorial = await ModifierTutorial.deploy();
    await modifierTutorial.deployed();
    owner = await modifierTutorial.owner();
  });

  it("should return getName function", async function () {
    expect(await modifierTutorial.getName()).to.equal("");
  });

  it("should fail to change name with onlyOwner modifier for non-owner address", async function () {
    const newName = "John";
    await expect(
      modifierTutorial.connect(ethers.provider.getSigner(1)).changeName(newName)
    ).to.be.revertedWith("Only owner can call this function.");
    expect(await modifierTutorial.getName()).to.equal("");
  });

  it("should change name with onlyOwner modifier for owner address", async function () {
    const newName = "John";
    await expect(modifierTutorial.changeName(newName))
      .to.emit(modifierTutorial, "NameChanged")
      .withArgs(newName);
    expect(await modifierTutorial.getName()).to.equal(newName);
  });

  it("should change onwer with onlyOwner modifier for owner address", async function () {
    const newOwner = await ethers.provider.getSigner(1);
    await expect(modifierTutorial.changeOwner(newOwner.address))
      .to.emit(modifierTutorial, "OwnerChanged")
      .withArgs(newOwner.address);
    expect(await modifierTutorial.owner()).to.equal(newOwner.address);
  });

  it("should fail to change onwer with onlyOwner modifier for non-owner address", async function () {
    // const newOwner = await ethers.provider.getSigner(1);
    const randomWallet = ethers.Wallet.createRandom();
    await expect(
      modifierTutorial.connect(randomWallet).changeOwner(newOwner.address)
    ).to.be.revertedWith("Only owner can call this function.");
    expect(await modifierTutorial.owner()).to.equal(owner);
  });
});
