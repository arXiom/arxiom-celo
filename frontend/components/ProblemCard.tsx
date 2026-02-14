"use client";

import { formatEther } from "viem";
import { Problem } from "@/hooks/useArxiom";
import Link from "next/link";

interface ProblemCardProps {
  problem: Problem;
  solutionCount?: bigint;
}

export default function ProblemCard({ problem, solutionCount = 0n }: ProblemCardProps) {
  const bountyAmount = formatEther(problem.bountyAmount);

  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Problem #{problem.id.toString()}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Creator: {problem.creator.slice(0, 6)}...{problem.creator.slice(-4)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{bountyAmount} cUSD</div>
          <div className="text-sm text-gray-500">Bounty</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <strong>IPFS Hash:</strong> {problem.metadataIPFS}
        </p>
        <div className="flex gap-4 text-sm">
          <span className={`px-2 py-1 rounded ${problem.isSolved ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {problem.isSolved ? "Solved" : "Active"}
          </span>
          <span className="text-gray-600">
            {solutionCount.toString()} solution{solutionCount !== 1n ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/solver?problemId=${problem.id.toString()}`}
          className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
        {!problem.isSolved && problem.chosenSolver === "0x0000000000000000000000000000000000000000" && (
          <Link
            href={`/solver?problemId=${problem.id.toString()}`}
            className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Submit Solution
          </Link>
        )}
      </div>
    </div>
  );
}
