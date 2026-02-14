"use client";

import { useState } from "react";
import { usePostProblem } from "@/hooks/useArxiom";
import { useAccount } from "wagmi";
import WalletButton from "@/components/WalletButton";
import Link from "next/link";

export default function CreateProblemPage() {
  const [metadataIPFS, setMetadataIPFS] = useState("");
  const [bountyAmount, setBountyAmount] = useState("");
  const { postProblem, isPending, isSuccess, error } = usePostProblem();
  const { isConnected } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadataIPFS.trim() || !bountyAmount) {
      return;
    }

    try {
      await postProblem(metadataIPFS, bountyAmount);
      // Reset form on success
      if (isSuccess) {
        setMetadataIPFS("");
        setBountyAmount("");
      }
    } catch (err) {
      console.error("Failed to post problem:", err);
    }
  };

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

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Post a New Problem
        </h1>

        {!isConnected ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              Please connect your wallet to post a problem.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <div>
              <label htmlFor="metadataIPFS" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Problem Description (IPFS Hash)
              </label>
              <input
                id="metadataIPFS"
                type="text"
                value={metadataIPFS}
                onChange={(e) => setMetadataIPFS(e.target.value)}
                placeholder="Qm..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the IPFS hash of your problem description document
              </p>
            </div>

            <div>
              <label htmlFor="bountyAmount" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Bounty Amount (cUSD)
              </label>
              <input
                id="bountyAmount"
                type="number"
                step="0.01"
                min="0"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(e.target.value)}
                placeholder="100.00"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Amount of cUSD to escrow as bounty for solving this problem
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200">
                  Error: {error.message}
                </p>
              </div>
            )}

            {isSuccess && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200">
                  Problem posted successfully! You can view it in the marketplace.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !metadataIPFS.trim() || !bountyAmount}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isPending ? "Posting Problem..." : "Post Problem"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
