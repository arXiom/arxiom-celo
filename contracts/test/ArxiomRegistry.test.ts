import { expect } from "chai";
import { ethers } from "hardhat";
import { ArxiomRegistry } from "../typechain-types";
import { MockERC20 } from "../typechain-types";

describe("ArxiomRegistry", function () {
  let registry: ArxiomRegistry;
  let cUSDToken: MockERC20;
  let owner: any;
  let researcher: any;
  let solver: any;
  let cUSDTokenAddress: string;

  beforeEach(async function () {
    [owner, researcher, solver] = await ethers.getSigners();

    // Deploy a mock ERC20 token for testing
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy();
    cUSDTokenAddress = await mockToken.getAddress();
    cUSDToken = mockToken;

    // Mint tokens to researcher
    await mockToken.mint(researcher.address, ethers.parseEther("1000"));

    // Deploy ArxiomRegistry
    const ArxiomRegistryFactory = await ethers.getContractFactory("ArxiomRegistry");
    registry = await ArxiomRegistryFactory.deploy(cUSDTokenAddress);
  });

  describe("Deployment", function () {
    it("Should set the correct cUSD token address", async function () {
      expect(await registry.cUSDToken()).to.equal(cUSDTokenAddress);
    });
  });

  describe("postProblem", function () {
    it("Should allow posting a problem with bounty", async function () {
      const bountyAmount = ethers.parseEther("100");
      const ipfsHash = "QmTest123";

      // Approve tokens
      await cUSDToken.connect(researcher).approve(await registry.getAddress(), bountyAmount);

      // Post problem
      await expect(registry.connect(researcher).postProblem(ipfsHash, bountyAmount))
        .to.emit(registry, "ProblemPosted")
        .withArgs(1, researcher.address, bountyAmount, ipfsHash);

      const problem = await registry.problems(1);
      expect(problem.id).to.equal(1);
      expect(problem.creator).to.equal(researcher.address);
      expect(problem.bountyAmount).to.equal(bountyAmount);
      expect(problem.metadataIPFS).to.equal(ipfsHash);
      expect(problem.isSolved).to.be.false;
    });

    it("Should reject zero bounty", async function () {
      await expect(
        registry.connect(researcher).postProblem("QmTest", 0)
      ).to.be.revertedWith("Bounty must be greater than 0");
    });

    it("Should reject empty IPFS hash", async function () {
      const bountyAmount = ethers.parseEther("100");
      await cUSDToken.connect(researcher).approve(await registry.getAddress(), bountyAmount);

      await expect(
        registry.connect(researcher).postProblem("", bountyAmount)
      ).to.be.revertedWith("IPFS hash required");
    });
  });

  describe("submitSolution", function () {
    beforeEach(async function () {
      const bountyAmount = ethers.parseEther("100");
      await cUSDToken.connect(researcher).approve(await registry.getAddress(), bountyAmount);
      await registry.connect(researcher).postProblem("QmProblem", bountyAmount);
    });

    it("Should allow submitting a solution", async function () {
      const solutionIPFS = "QmSolution123";

      await expect(registry.connect(solver).submitSolution(1, solutionIPFS))
        .to.emit(registry, "SolutionSubmitted")
        .withArgs(1, solver.address, solutionIPFS);

      const solutionCount = await registry.getSolutionCount(1);
      expect(solutionCount).to.equal(1);
    });

    it("Should prevent duplicate submissions", async function () {
      await registry.connect(solver).submitSolution(1, "QmSolution1");
      await expect(
        registry.connect(solver).submitSolution(1, "QmSolution2")
      ).to.be.revertedWith("Already submitted solution");
    });

    it("Should reject solution for solved problem", async function () {
      await registry.connect(solver).submitSolution(1, "QmSolution1");
      await registry.connect(researcher).selectWinner(1, 0);

      await expect(
        registry.connect(solver).submitSolution(1, "QmSolution2")
      ).to.be.revertedWith("Problem already solved");
    });
  });

  describe("selectWinner", function () {
    beforeEach(async function () {
      const bountyAmount = ethers.parseEther("100");
      await cUSDToken.connect(researcher).approve(await registry.getAddress(), bountyAmount);
      await registry.connect(researcher).postProblem("QmProblem", bountyAmount);
      await registry.connect(solver).submitSolution(1, "QmSolution1");
    });

    it("Should allow creator to select winner", async function () {
      const initialBalance = await cUSDToken.balanceOf(solver.address);
      const bountyAmount = ethers.parseEther("100");

      await expect(registry.connect(researcher).selectWinner(1, 0))
        .to.emit(registry, "BountyClaimed")
        .withArgs(1, solver.address, bountyAmount);

      const problem = await registry.problems(1);
      expect(problem.isSolved).to.be.true;
      expect(problem.chosenSolver).to.equal(solver.address);

      const finalBalance = await cUSDToken.balanceOf(solver.address);
      expect(finalBalance - initialBalance).to.equal(bountyAmount);
    });

    it("Should reject non-creator from selecting winner", async function () {
      await expect(
        registry.connect(solver).selectWinner(1, 0)
      ).to.be.revertedWith("Only creator can select winner");
    });
  });
});
