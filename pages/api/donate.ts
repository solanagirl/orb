// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";

export interface ActionPostResponse {
    /** base64 encoded serialized transaction */
    transaction: string;
    /** describes the nature of the transaction */
    message?: string;
  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActionPostResponse>,
) {
  try {
  if (req.method == 'OPTIONS') {
    res.status(200).end();   
    return res;
  } else if (req.method == 'POST') {
    const connection = new Connection('https://nonah-735t00-fast-mainnet.helius-rpc.com')
    const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const amount = parseFloat(req.query.amount![0]);
      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: new PublicKey(req.body.account),
              toPubkey: new PublicKey('6n9FpZgTgbhoB8dxw9wfzGkC4r5Qrf9wU69SfkY6s7Nk'),
              lamports: amount * LAMPORTS_PER_SOL
          })
      )

      transaction.recentBlockhash = recentBlockhash;
  
      const serializedTransaction = transaction.serialize();
      const txString = serializedTransaction.toString('base64')

      res.status(200).json({ transaction: txString, message: `Donate ${req.query.amount} SOL to the Orb` });   
      return res;
    }
  } catch (err) {
    res.status(500).json({ transaction: '', message: `Error: ${err}` });
    return res;
  }
}
