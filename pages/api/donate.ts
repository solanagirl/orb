// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";

export interface ActionPostResponse {
    /** base64 encoded serialized transaction */
    transaction: string;
    /** describes the nature of the transaction */
    message?: string;
  }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActionPostResponse>,
) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Content-Encoding', 'compress');
    res.setHeader('Content-Type', 'application/json');

    const amount = parseFloat(req.query.amount![0]);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(req.body.account),
            toPubkey: new PublicKey('6n9FpZgTgbhoB8dxw9wfzGkC4r5Qrf9wU69SfkY6s7Nk'),
            lamports: amount / LAMPORTS_PER_SOL
        })
    )

    const serializedTransaction = transaction.serialize();
    const txString = serializedTransaction.toString('base64')

  
  res.status(200).json({ transaction: txString, message: `Donate ${req.query.amount} SOL to the Orb` });
}
