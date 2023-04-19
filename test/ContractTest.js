const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ModifierTutorial", function () {
  let modifierTutorial;
  let owner;
  let admin;
  let addr1;
  let addr2;
  const newName = "New Name";

  beforeEach(async () => {
    [owner, admin, addr1, addr2] = await ethers.getSigners();
    const ModifierTutorial = await ethers.getContractFactory(
      "ModifierTutorial"
    );
    modifierTutorial = await ModifierTutorial.deploy();
    await modifierTutorial.deployed();
    await modifierTutorial.addAdmin(admin.address);
  });

  describe("changeName", function () {
    it("should change the name", async function () {
      await modifierTutorial.connect(admin).changeName(newName);
      expect(await modifierTutorial.getName()).to.equal(newName);
    });

    it("should revert if called by non-admin", async function () {
      await expect(
        modifierTutorial.connect(addr1).changeName(newName)
      ).to.be.revertedWith("Only admin can call this function.");
    });
  });

  describe("addAdmin", function () {
    it("should add an admin", async function () {
      await modifierTutorial.connect(owner).addAdmin(addr1.address);
      expect(await modifierTutorial.isAdmin(addr1.address)).to.be.true;
    });

    it("should revert if called by non-owner", async function () {
      await expect(
        modifierTutorial.connect(addr1).addAdmin(addr2.address)
      ).to.be.revertedWith("Only owner can call this function.");
    });
  });

  describe("removeAdmin", function () {
    beforeEach(async () => {
      await modifierTutorial.connect(owner).addAdmin(addr1.address);
    });

    it("should remove an admin", async function () {
      await modifierTutorial.connect(owner).removeAdmin(addr1.address);
      expect(await modifierTutorial.isAdmin(addr1.address)).to.be.false;
    });

    it("should revert if called by non-owner", async function () {
      await expect(
        modifierTutorial.connect(addr1).removeAdmin(addr2.address)
      ).to.be.revertedWith("Only owner can call this function.");
    });
  });

  describe("changeOwner", function () {
    it("should change the owner", async function () {
      await modifierTutorial.connect(owner).changeOwner(addr1.address);
      expect(await modifierTutorial.getOwner()).to.equal(addr1.address);
    });

    it("should revert if called by non-owner", async function () {
      await expect(
        modifierTutorial.connect(addr1).changeOwner(addr2.address)
      ).to.be.revertedWith("Only owner can call this function.");
    });
  });

  describe("deposit", function () {
    const amount = 1;

    it("should deposit funds", async function () {
      // Check user balance before deposit
      const initialBalance = await modifierTutorial.getUserBalance();

      // Deposit 1 ether
      await modifierTutorial.deposit({
        value: ethers.utils.parseEther("1"),
      });

      // Check user balance after deposit
      const finalBalance = await modifierTutorial.getUserBalance();
      expect(finalBalance).to.equal(
        initialBalance.add(ethers.utils.parseEther("1"))
      );
    });

    it("should revert if deposit amount is zero", async function () {
      await expect(
        modifierTutorial.connect(addr1).deposit({
          value: ethers.utils.parseEther("0"),
        })
      ).to.be.revertedWith("Deposit amount must be greater than zero");
    });
  });

  describe("Withdraw", function () {
    it("should withdraw funds from user balance", async function () {
      // Deposit 1 ether into user's balance
      await modifierTutorial.connect(addr1).deposit({
        value: ethers.utils.parseEther("1"),
      });

      // Try to withdraw 2 ether from user's balance
      await expect(
        modifierTutorial.connect(addr1).withdraw(ethers.utils.parseEther("2"))
      ).to.be.revertedWith("Not enough funds");
    });

    it("should revert if withdrawing more funds than user has", async function () {
      const amount = ethers.utils.parseEther("1");
      await expect(
        modifierTutorial.connect(addr1).withdraw(amount)
      ).to.be.revertedWith("Not enough funds");
    });

    it("should revert if withdrawing an invalid amount", async function () {
      const amount = ethers.utils.parseEther("0");
      await expect(
        modifierTutorial.connect(addr1).withdraw(amount)
      ).to.be.revertedWith("Invalid amount");
    });
  });

  describe("Admin functions", function () {
    it("should allow owner to add admin", async function () {
      await modifierTutorial.addAdmin(addr2.address);
      expect(await modifierTutorial.isAdmin(addr2.address)).to.equal(true);
    });

    it("should revert if non-owner tries to add admin", async function () {
      await expect(
        modifierTutorial.connect(addr1).addAdmin(addr2.address)
      ).to.be.revertedWith("Only owner can call this function.");
    });

    it("should allow owner to remove admin", async function () {
      await modifierTutorial.addAdmin(addr2.address);
      await modifierTutorial.removeAdmin(addr2.address);
      expect(await modifierTutorial.isAdmin(addr2.address)).to.equal(false);
    });

    it("should revert if non-owner tries to remove admin", async function () {
      await expect(
        modifierTutorial.connect(addr1).removeAdmin(addr2.address)
      ).to.be.revertedWith("Only owner can call this function.");
    });
  });
});
