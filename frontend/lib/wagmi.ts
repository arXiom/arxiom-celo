import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { celo, celoAlfajores } from "viem/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "arXiom",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [celoAlfajores, celo],
  transports: {
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
    [celo.id]: http(),
  },
});
