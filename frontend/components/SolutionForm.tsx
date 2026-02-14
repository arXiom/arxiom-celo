"use client";

import { useState } from "react";
import { useSubmitSolution } from "@/hooks/useArxiom";
import { useAccount } from "wagmi";

interface SolutionFormProps {
  problemId: bigint;
  onSuccess?: () => void;
}

export default function SolutionForm({ problemId, onSuccess }: SolutionFormProps) {
  const [solutionIPFS, setSolutionIPFS] = useState("");
  const { submitSolution, isPending, isSuccess, error } = useSubmitSolution();
  const { isConnected } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionIPFS.trim()) {
      return;
    }

    try {
      await submitSolution(problemId, solutionIPFS);
      if (onSuccess) {
        onSuccess();
      }
      setSolutionIPFS("");
    } catch (err) {
      console.error("Failed to submit solution:", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        Please connect your wallet to submit a solution.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="solutionIPFS" className="block text-sm font-medium mb-2">
          Solution IPFS Hash
        </label>
        <input
          id="solutionIPFS"
          type="text"
          value={solutionIPFS}
          onChange={(e) => setSolutionIPFS(e.target.value)}
          placeholder="Qm..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the IPFS hash of your solution document
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
          Error: {error.message}
        </div>
      )}

      {isSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">
          Solution submitted successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !solutionIPFS.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Submitting..." : "Submit Solution"}
      </button>
    </form>
  );
}
