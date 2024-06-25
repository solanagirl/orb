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
  res.status(200).json({ transaction: "John Doe", message: `Donate ${req.query.amount} SOL to the Orb` });
}
