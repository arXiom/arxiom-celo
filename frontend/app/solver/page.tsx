"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useProblem, useSolutionCount, useSelectWinner } from "@/hooks/useArxiom";
import { useReadContract } from "wagmi";
import { ARXIOM_REGISTRY_ABI, ARXIOM_REGISTRY_ADDRESS } from "@/lib/contracts";
import SolutionForm from "@/components/SolutionForm";
import WalletButton from "@/components/WalletButton";
import Link from "next/link";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

export default function SolverPage() {
  const searchParams = useSearchParams();
  const problemIdParam = searchParams.get("problemId");
  const problemId = problemIdParam ? BigInt(problemIdParam) : null;
  const { problem, isLoading: problemLoading } = useProblem(problemId);
  const { count: solutionCount } = useSolutionCount(problemId);
  const { address } = useAccount();
  const [solutions, setSolutions] = useState<any[]>([]);
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState<string>("");

  useEffect(() => {
    const fetchSolutions = async () => {
      if (!problemId || solutionCount === 0n) {
        setSolutions([]);
        return;
      }

      const solutionList = [];
      for (let i = 0n; i < solutionCount; i++) {
        // Fetch each solution
        // In production, use batch calls or subgraph
        solutionList.push(i);
      }
      setSolutions(solutionList);
    };

    fetchSolutions();
  }, [problemId, solutionCount]);

  if (!problemId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              arXiom
            </Link>
            <WalletButton />
          </div>
        </nav>
        <main className="container mx-auto px-4 py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Please select a problem from the marketplace.
          </p>
        </main>
      </div>
    );
  }

  if (problemLoading || !problem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              arXiom
            </Link>
            <WalletButton />
          </div>
        </nav>
        <main className="container mx-auto px-4 py-12">
          <p>Loading problem...</p>
        </main>
      </div>
    );
  }

  const isCreator = address?.toLowerCase() === problem.creator.toLowerCase();
  const bountyAmount = formatEther(problem.bountyAmount);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            arXiom
          </Link>
          <WalletButton />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/marketplace"
          className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
        >
          ← Back to Marketplace
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                Problem #{problem.id.toString()}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created by: {problem.creator.slice(0, 6)}...{problem.creator.slice(-4)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{bountyAmount} cUSD</div>
              <div className="text-sm text-gray-500">Bounty</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Problem Description (IPFS)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 font-mono text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
              {problem.metadataIPFS}
            </p>
          </div>

          <div className="mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                problem.isSolved
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              {problem.isSolved ? "Solved" : "Active"}
            </span>
            {problem.isSolved && problem.chosenSolver !== "0x0000000000000000000000000000000000000000" && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Winner: {problem.chosenSolver.slice(0, 6)}...{problem.chosenSolver.slice(-4)}
              </p>
            )}
          </div>
        </div>

        {!problem.isSolved && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Submit a Solution
            </h2>
            <SolutionForm problemId={problemId} />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Solutions ({solutionCount.toString()})
          </h2>

          {solutionCount === 0n ? (
            <p className="text-gray-600 dark:text-gray-400">No solutions submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {solutions.map((index) => (
                <SolutionItem
                  key={index.toString()}
                  problemId={problemId}
                  solutionIndex={index}
                  isCreator={isCreator}
                  isSolved={problem.isSolved}
                />
              ))}
            </div>
          )}

          {isCreator && !problem.isSolved && solutionCount > 0n && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Select Winner
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max={(solutionCount - 1n).toString()}
                  value={selectedWinnerIndex}
                  onChange={(e) => setSelectedWinnerIndex(e.target.value)}
                  placeholder="Solution index"
                  className="px-4 py-2 border rounded-lg flex-1"
                />
                <SelectWinnerButton
                  problemId={problemId}
                  solverIndex={selectedWinnerIndex ? BigInt(selectedWinnerIndex) : null}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SolutionItem({
  problemId,
  solutionIndex,
  isCreator,
  isSolved,
}: {
  problemId: bigint;
  solutionIndex: bigint;
  isCreator: boolean;
  isSolved: boolean;
}) {
  const { data: solution, isLoading } = useReadContract({
    address: ARXIOM_REGISTRY_ADDRESS as `0x${string}`,
    abi: ARXIOM_REGISTRY_ABI,
    functionName: "getSolution",
    args: [problemId, solutionIndex],
    query: {
      enabled: !!ARXIOM_REGISTRY_ADDRESS,
    },
  });

  if (isLoading || !solution) {
    return <div className="border rounded-lg p-4">Loading solution...</div>;
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            Solution #{solutionIndex.toString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Solver: {solution.solver.slice(0, 6)}...{solution.solver.slice(-4)}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(Number(solution.timestamp) * 1000).toLocaleString()}
        </p>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded mt-2">
        {solution.solutionIPFS}
      </p>
    </div>
  );
}

function SelectWinnerButton({
  problemId,
  solverIndex,
}: {
  problemId: bigint;
  solverIndex: bigint | null;
}) {
  const { selectWinner, isPending, isSuccess, error } = useSelectWinner();

  const handleSelect = async () => {
    if (solverIndex === null) return;
    try {
      await selectWinner(problemId, solverIndex);
    } catch (err) {
      console.error("Failed to select winner:", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleSelect}
        disabled={isPending || solverIndex === null}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Selecting..." : "Select Winner"}
      </button>
      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
      {isSuccess && <p className="text-green-600 text-sm mt-1">Winner selected!</p>}
    </div>
  );
}
