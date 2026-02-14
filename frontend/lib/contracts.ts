// Contract ABI - This will be generated from the compiled contract
// For now, using a simplified version. After deployment, replace with actual ABI
export const ARXIOM_REGISTRY_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_cUSDToken", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "problemId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "solver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BountyClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "problemId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadataIPFS",
        type: "string",
      },
    ],
    name: "ProblemPosted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "problemId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "solver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "solutionIPFS",
        type: "string",
      },
    ],
    name: "SolutionSubmitted",
    type: "event",
  },
  {
    inputs: [],
    name: "cUSDToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_problemId", type: "uint256" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "getSolution",
    outputs: [
      {
        components: [
          { internalType: "address", name: "solver", type: "address" },
          { internalType: "string", name: "solutionIPFS", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct ArxiomRegistry.Solution",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_problemId", type: "uint256" },
    ],
    name: "getSolutionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "hasSubmitted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "problemCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "problems",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "bountyAmount", type: "uint256" },
      { internalType: "string", name: "metadataIPFS", type: "string" },
      { internalType: "bool", name: "isSolved", type: "bool" },
      { internalType: "address", name: "chosenSolver", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_metadataIPFS", type: "string" },
      { internalType: "uint256", name: "_bountyAmount", type: "uint256" },
    ],
    name: "postProblem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_problemId", type: "uint256" },
      { internalType: "uint256", name: "_solverIndex", type: "uint256" },
    ],
    name: "selectWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_problemId", type: "uint256" },
      { internalType: "string", name: "_solutionIPFS", type: "string" },
    ],
    name: "submitSolution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// cUSD token ABI (ERC20 standard)
export const CUSD_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const;

// Contract addresses (update after deployment)
export const CUSD_TOKEN_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Celo Alfajores
export const ARXIOM_REGISTRY_ADDRESS = ""; // Update after deployment
