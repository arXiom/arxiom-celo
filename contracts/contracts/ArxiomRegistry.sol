// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ArxiomRegistry
 * @notice A decentralized science marketplace where researchers post problems with bounties
 *         and AI agents compete to solve them
 */
contract ArxiomRegistry is ReentrancyGuard {
    // cUSD token address on Celo Alfajores
    IERC20 public immutable cUSDToken;
    
    // Problem struct
    struct Problem {
        uint256 id;
        address creator;
        uint256 bountyAmount;
        string metadataIPFS;
        bool isSolved;
        address chosenSolver;
    }
    
    // Solution struct
    struct Solution {
        address solver;
        string solutionIPFS;
        uint256 timestamp;
    }
    
    // State variables
    uint256 public problemCounter;
    mapping(uint256 => Problem) public problems;
    mapping(uint256 => Solution[]) public solutions; // problemId => solutions array
    mapping(uint256 => mapping(address => bool)) public hasSubmitted; // problemId => solver => has submitted
    
    // Events
    event ProblemPosted(
        uint256 indexed problemId,
        address indexed creator,
        uint256 bountyAmount,
        string metadataIPFS
    );
    
    event SolutionSubmitted(
        uint256 indexed problemId,
        address indexed solver,
        string solutionIPFS
    );
    
    event BountyClaimed(
        uint256 indexed problemId,
        address indexed solver,
        uint256 amount
    );
    
    /**
     * @notice Constructor sets the cUSD token address
     * @param _cUSDToken Address of the cUSD ERC20 token on Celo Alfajores
     */
    constructor(address _cUSDToken) {
        require(_cUSDToken != address(0), "Invalid token address");
        cUSDToken = IERC20(_cUSDToken);
    }
    
    /**
     * @notice Post a new problem with a bounty
     * @param _metadataIPFS IPFS hash containing problem description
     * @param _bountyAmount Amount of cUSD to escrow as bounty
     */
    function postProblem(
        string memory _metadataIPFS,
        uint256 _bountyAmount
    ) external nonReentrant {
        require(_bountyAmount > 0, "Bounty must be greater than 0");
        require(bytes(_metadataIPFS).length > 0, "IPFS hash required");
        
        // Transfer cUSD from user to contract escrow
        require(
            cUSDToken.transferFrom(msg.sender, address(this), _bountyAmount),
            "Transfer failed"
        );
        
        // Create new problem
        problemCounter++;
        problems[problemCounter] = Problem({
            id: problemCounter,
            creator: msg.sender,
            bountyAmount: _bountyAmount,
            metadataIPFS: _metadataIPFS,
            isSolved: false,
            chosenSolver: address(0)
        });
        
        emit ProblemPosted(problemCounter, msg.sender, _bountyAmount, _metadataIPFS);
    }
    
    /**
     * @notice Submit a solution for a problem
     * @param _problemId ID of the problem to solve
     * @param _solutionIPFS IPFS hash containing the solution
     */
    function submitSolution(
        uint256 _problemId,
        string memory _solutionIPFS
    ) external {
        require(_problemId > 0 && _problemId <= problemCounter, "Invalid problem ID");
        require(bytes(_solutionIPFS).length > 0, "IPFS hash required");
        
        Problem storage problem = problems[_problemId];
        require(!problem.isSolved, "Problem already solved");
        
        // Prevent duplicate submissions from same address
        require(!hasSubmitted[_problemId][msg.sender], "Already submitted solution");
        
        // Add solution
        solutions[_problemId].push(Solution({
            solver: msg.sender,
            solutionIPFS: _solutionIPFS,
            timestamp: block.timestamp
        }));
        
        hasSubmitted[_problemId][msg.sender] = true;
        
        emit SolutionSubmitted(_problemId, msg.sender, _solutionIPFS);
    }
    
    /**
     * @notice Select the winning solution and release bounty
     * @param _problemId ID of the problem
     * @param _solverIndex Index of the winning solution in the solutions array
     */
    function selectWinner(
        uint256 _problemId,
        uint256 _solverIndex
    ) external nonReentrant {
        require(_problemId > 0 && _problemId <= problemCounter, "Invalid problem ID");
        
        Problem storage problem = problems[_problemId];
        require(problem.creator == msg.sender, "Only creator can select winner");
        require(!problem.isSolved, "Problem already solved");
        require(_solverIndex < solutions[_problemId].length, "Invalid solution index");
        
        Solution memory winningSolution = solutions[_problemId][_solverIndex];
        address solver = winningSolution.solver;
        
        // Mark problem as solved
        problem.isSolved = true;
        problem.chosenSolver = solver;
        
        // Transfer bounty to solver
        require(
            cUSDToken.transfer(solver, problem.bountyAmount),
            "Transfer failed"
        );
        
        emit BountyClaimed(_problemId, solver, problem.bountyAmount);
    }
    
    /**
     * @notice Get the number of solutions for a problem
     * @param _problemId ID of the problem
     * @return Number of solutions
     */
    function getSolutionCount(uint256 _problemId) external view returns (uint256) {
        return solutions[_problemId].length;
    }
    
    /**
     * @notice Get a specific solution for a problem
     * @param _problemId ID of the problem
     * @param _index Index of the solution
     * @return Solution struct
     */
    function getSolution(
        uint256 _problemId,
        uint256 _index
    ) external view returns (Solution memory) {
        require(_index < solutions[_problemId].length, "Invalid solution index");
        return solutions[_problemId][_index];
    }
}
