"use client";

import { useEffect, useState } from "react";
import { useProblemCount, useProblem, useSolutionCount } from "@/hooks/useArxiom";
import ProblemCard from "@/components/ProblemCard";
import WalletButton from "@/components/WalletButton";
import Link from "next/link";

export default function MarketplacePage() {
  const { count } = useProblemCount();
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all problems
    const fetchProblems = async () => {
      if (count === 0n) {
        setProblems([]);
        return;
      }

      const problemList = [];
      for (let i = 1n; i <= count; i++) {
        // In a real app, you'd batch these calls or use a subgraph
        // For now, we'll fetch them individually
        problemList.push(i);
      }
      setProblems(problemList);
    };

    fetchProblems();
  }, [count]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            arXiom
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              href="/create-problem"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Post Problem
            </Link>
            <WalletButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Problem Marketplace
        </h1>

        {count === 0n ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No problems posted yet.
            </p>
            <Link
              href="/create-problem"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Be the first to post a problem
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problemId) => (
              <ProblemCardWrapper key={problemId.toString()} problemId={problemId} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProblemCardWrapper({ problemId }: { problemId: bigint }) {
  const { problem } = useProblem(problemId);
  const { count: solutionCount } = useSolutionCount(problemId);

  if (!problem) {
    return <div className="border rounded-lg p-6">Loading...</div>;
  }

  return <ProblemCard problem={problem} solutionCount={solutionCount} />;
}
