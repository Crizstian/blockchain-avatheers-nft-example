// Load dependencies
const { expect } = require("chai")

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers")
const { accounts, contract } = require("@openzeppelin/test-environment")

// Load compiled artifacts
const Avatheeers = contract.fromArtifact("Avatheeers")

const wait = (s) => {
	const milliseconds = s * 1000
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

describe("Avatheeers", function () {
	const [owner, other] = accounts

	// deploy a new Avatheeers contract for each test
	beforeEach(async function () {
		this.contract = await Avatheeers.new({ from: owner })
	})

	it("creates a new avatheer", async function () {
		const receipt = await this.contract.createRandomAvatheeer("Cristian", {
			from: owner,
		})

		expectEvent(receipt, "NewAvatheeerCreated", {
			name: "Cristian",
			owner: owner,
		})
	})

	it("get avatheeer by owner", async function () {
		await this.contract.createRandomAvatheeer("Cristian", { from: owner })
		const receipt = await this.contract.getAvatheeersByOwner(owner, {
			from: owner,
		})
		expect(receipt).to.have.lengthOf(1)
	})

	it("get balanceOf number of tokens assigned to owner", async function () {
		await this.contract.createRandomAvatheeer("Hello", { from: other })
		const receipt = await this.contract.balanceOf(other, { from: other })
		expect(receipt.toString()).to.be.equal("1")

		await this.contract.createRandomAvatheeer("World", { from: other })
		const receipt2 = await this.contract.balanceOf(other, { from: other })
		expect(receipt2.toString()).to.be.equal("2")
	})

	it("get ownerOf Avathteeer id", async function () {
		await this.contract.createRandomAvatheeer("Hello", { from: other })
		const receipt = await this.contract.ownerOf(0, { from: other })
		expect(receipt).to.be.equal(other)

		await this.contract.createRandomAvatheeer("World", { from: other })
		const receipt2 = await this.contract.ownerOf(1, { from: other })
		expect(receipt2).to.be.equal(other)
	})

	it("transfer Avathteeer id from one account to another", async function () {
		await this.contract.createRandomAvatheeer("Hello", { from: owner })
		const receipt = await this.contract.ownerOf(0, { from: owner })
		expect(receipt).to.be.equal(owner)

		await this.contract.createRandomAvatheeer("World", { from: other })
		const receipt2 = await this.contract.ownerOf(1, { from: other })
		expect(receipt2).to.be.equal(other)

		const approve = await this.contract.approve(other, 0, { from: owner })
		expectEvent(approve, "Approval", {
			owner: owner,
			approved: other,
			tokenId: "0",
		})

		const transfer = await this.contract.transferFrom(owner, other, 0, {
			from: owner,
		})
		expectEvent(transfer, "Transfer", {
			from: owner,
			to: other,
			tokenId: "0",
		})

		const receipt3 = await this.contract.ownerOf(0, { from: other })
		expect(receipt3).to.be.equal(other)
	})

	it("take ownership of Avathteeer id from an approved account", async function () {
		await this.contract.createRandomAvatheeer("Hello", { from: owner })
		const receipt = await this.contract.ownerOf(0, { from: owner })
		expect(receipt).to.be.equal(owner)

		await this.contract.createRandomAvatheeer("World", { from: other })
		const receipt2 = await this.contract.ownerOf(1, { from: other })
		expect(receipt2).to.be.equal(other)

		const approve = await this.contract.approve(other, 0, { from: owner })
		expectEvent(approve, "Approval", {
			owner: owner,
			approved: other,
			tokenId: "0",
		})

		const transfer = await this.contract.takeOwnership(0, {
			from: other,
		})
		expectEvent(transfer, "Transfer", {
			from: owner,
			to: other,
			tokenId: "0",
		})

		const receipt3 = await this.contract.ownerOf(0, { from: other })
		expect(receipt3).to.be.equal(other)
	})

	// it("non owner cannot store a value", async function () {
	// 	await expectRevert(
	// 		this.contract.store(value, { from: other }),
	// 		"Ownable: caller is not the owner"
	// 	)
	// })
})
