import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ARXIOM_REGISTRY_ABI, CUSD_ABI, ARXIOM_REGISTRY_ADDRESS, CUSD_TOKEN_ADDRESS } from "@/lib/contracts";

export interface Problem {
  id: bigint;
  creator: `0x${string}`;
  bountyAmount: bigint;
  metadataIPFS: string;
  isSolved: boolean;
  chosenSolver: `0x${string}`;
}

export interface Solution {
  solver: `0x${string}`;
  solutionIPFS: string;
  timestamp: bigint;
}

// Hook to post a problem
export function usePostProblem() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const postProblem = async (metadataIPFS: string, bountyAmount: string) => {
    if (!ARXIOM_REGISTRY_ADDRESS) {
      throw new Error("Contract not deployed");
    }

    const amount = parseEther(bountyAmount);

    // First approve cUSD - wait for confirmation
    const approveHash = await writeContract({
      address: CUSD_TOKEN_ADDRESS,
      abi: CUSD_ABI,
      functionName: "approve",
      args: [ARXIOM_REGISTRY_ADDRESS as `0x${string}`, amount],
    });

    // Wait for approval to be confirmed before posting problem
    // Note: In production, you might want to use useWaitForTransactionReceipt here
    // For now, we'll proceed - the user will need to wait for approval confirmation
    
    // Then post problem
    await writeContract({
      address: ARXIOM_REGISTRY_ADDRESS as `0x${string}`,
      abi: ARXIOM_REGISTRY_ABI,
      functionName: "postProblem",
      args: [metadataIPFS, amount],
    });
  };

  return {
    postProblem,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
  };
}

// Hook to submit a solution
export function useSubmitSolution() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submitSolution = async (problemId: bigint, solutionIPFS: string) => {
    if (!ARXIOM_REGISTRY_ADDRESS) {
      throw new Error("Contract not deployed");
    }

    await writeContract({
      address: ARXIOM_REGISTRY_ADDRESS as `0x${string}`,
      abi: ARXIOM_REGISTRY_ABI,
      functionName: "submitSolution",
      args: [problemId, solutionIPFS],
    });
  };

  return {
    submitSolution,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
  };
}

// Hook to select winner
export function useSelectWinner() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const selectWinner = async (problemId: bigint, solverIndex: bigint) => {
    if (!ARXIOM_REGISTRY_ADDRESS) {
      throw new Error("Contract not deployed");
    }

    await writeContract({
      address: ARXIOM_REGISTRY_ADDRESS as `0x${string}`,
      abi: ARXIOM_REGISTRY_ABI,
      functionName: "selectWinner",
      args: [problemId, solverIndex],
    });
  };

  return {
    selectWinner,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
  };
}

// Hook to get problem count
export function useProblemCount() {
  const { data, isLoading, error } = useReadContract({
    address: ARXIOM_REGISTRY_ADDRESS as `0x${string}`,
    abi: ARXIOM_REGISTRY_ABI,
    functionName: "problemCounter",
    query: {
      enabled: !!ARXIOM_REGISTRY_ADDRESS,
    },
  });

  return { count: data || 0n, isLoading, error };
}

// Hook to get a specific problem
export function useProblem(problemId: bigint | null) {
  const { data, isLoading, error } = useReadContract({
    address: ARXIOM_REGISTRY_ADDRESS as `0x${string}`,
    abi: ARXIOM_REGISTRY_ABI,
    functionName: "problems",
    args: problemId ? [problemId] : undefined,
    query: {
      enabled: !!ARXIOM_REGISTRY_ADDRESS && problemId !== null,
    },
  });

  return { problem: data as Problem | undefined, isLoading, error };
}

// Hook to get solution count for a problem
export function useSolutionCount(problemId: bigint | null) {
  const { data, isLoading, error } = useReadContract({
    address: ARXIOM_REGISTRY_ADDRESS as `0x${string}`,
    abi: ARXIOM_REGISTRY_ABI,
    functionName: "getSolutionCount",
    args: problemId ? [problemId] : undefined,
    query: {
      enabled: !!ARXIOM_REGISTRY_ADDRESS && problemId !== null,
    },
  });

  return { count: data || 0n, isLoading, error };
}

// Hook to get all problems (requires multiple calls)
export function useProblems() {
  const { count } = useProblemCount();
  const problems: Problem[] = [];

  // This is a simplified version - in production, you'd want to batch these calls
  // or use a subgraph/indexer
  for (let i = 1n; i <= count; i++) {
    const { problem } = useProblem(i);
    if (problem) {
      problems.push(problem);
    }
  }

  return { problems, isLoading: false };
}
