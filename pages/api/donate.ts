// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  
  res.status(200).json({ transaction: "John Doe", message: `Donate ${req.query.amount} SOL to the Orb` });
}
