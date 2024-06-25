// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintCloseAuthorityInstruction,
  getMint,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateHexagram, mapLinesToHexagramDetails } from "@/src/generateReading";

export interface ActionPostResponse {
    /** base64 encoded serialized transaction */
    transaction: string;
    /** describes the nature of the transaction */
    message?: string;
  }

export interface ActionError {
  /** non-fatal error message to be displayed to the user */
  message: string;
} 

export interface ActionGetResponse {
  /** image url that represents the source of the action request */
  icon: string;
  /** describes the source of the action request */
  title: string;
  /** brief summary of the action to be performed */
  description: string;
  /** button text rendered to the user */
  label: string;
  /** UI state for the button being rendered to the user */
  disabled?: boolean;
  links?: {
    /** list of related Actions a user could perform */
    actions: LinkedAction[];
  };
  /** non-fatal error message to be displayed to the user */
  error?: ActionError;
}


export interface LinkedAction {
  /** URL endpoint for an action */
  href: string;
  /** button text rendered to the user */
  label: string;
  /** Parameter to accept user input within an action */
  parameters?: [ActionParameter];
}

/** Parameter to accept user input within an action */
export interface ActionParameter {
  /** parameter name in url */
  name: string;
  /** placeholder text for the user input field */
  label?: string;
  /** declare if this field is required (defaults to `false`) */
  required?: boolean;
}

async function createNFT(account: string) {
    const connection = new Connection('https://nonah-735t00-fast-mainnet.helius-rpc.com');
    const userPublicKey = new PublicKey(account);
    const orbSigner = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.ORB_SECRET!)));

    let transaction: Transaction;
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const decimals = 0;
    const mintAuthority = orbSigner.publicKey;
    const updateAuthority = orbSigner.publicKey;

    const reading = mapLinesToHexagramDetails(generateHexagram());

    // Size of Mint Account with extension
    const mintLen = getMintLen([
      ExtensionType.MetadataPointer,
      ExtensionType.MintCloseAuthority,
    ]);
  
    // Metadata to store in Mint Account
    const metaData: TokenMetadata = {
      updateAuthority: updateAuthority,
      mint: mint,
      name: reading.name ? `${reading.id}:${reading.name}` : `To be deciphered...`,
      symbol: 'ORB',
      uri: 'https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/askorbxyz.PNG',
      additionalMetadata: [],
      // additionalMetadata: [[ "code", reading.representation!], ["description", reading.creative_description!], ["keywords", reading.keywords!.toString()], ["advice", reading.advice!], ["changing aspects", reading.changing?.filter((line) => { if (line !== undefined) { return {line}.line.line_number }}).toString()!]],
    };

    // Size of MetadataExtension 2 bytes for type, 2 bytes for length
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    // Size of metadata
    const metadataLen = pack(metaData).length;
  
    // Minimum lamports required for Mint Account
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataExtension + metadataLen
    );
  
    // Instruction to invoke System Program to create new account
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: userPublicKey, // Account that will transfer lamports to created account
      newAccountPubkey: mint, // Address of the account to create
      space: mintLen, // Amount of bytes to allocate to the created account
      lamports, // Amount of lamports transferred to created account
      programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    });
  
    // Instruction to initialize the MetadataPointer Extension
    const initializeMetadataPointerInstruction =
      createInitializeMetadataPointerInstruction(
        mint, // Mint Account address
        updateAuthority, // Authority that can set the metadata address
        mint, // Account address that holds the metadata
        TOKEN_2022_PROGRAM_ID
      );
    // Instruction to initialize the MintCloseAuthority Extension
    const initializeMintCloseAuthorityInstruction =
      createInitializeMintCloseAuthorityInstruction(
        mint, // Mint Account address
        mintAuthority, // Designated Close Authority
        TOKEN_2022_PROGRAM_ID // Token Extension Program ID
      );
  
    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMintInstruction(
      mint, // Mint Account Address
      decimals, // Decimals of Mint
      mintAuthority, // Designated Mint Authority
      null, // Optional Freeze Authority
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );
  
    // Instruction to initialize Metadata Account data
    const initializeMetadataInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: updateAuthority, // Authority that can update the metadata
      mint: mint, // Mint Account address
      mintAuthority: mintAuthority, // Designated Mint Authority
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    });

    // Add instructions to new transaction
    transaction = new Transaction().add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      initializeMintCloseAuthorityInstruction,
      initializeMintInstruction,
      initializeMetadataInstruction,
    )
    
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = userPublicKey;
    transaction.sign(orbSigner);
    transaction.sign(mintKeypair);

    const serializedTransaction = transaction.serialize({requireAllSignatures: false});
    const txString = serializedTransaction.toString('base64');


    return txString;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActionPostResponse | ActionGetResponse | ActionError>,
) {
  try {
    if (req.method == 'OPTIONS') {
      res.status(200).end();   
      return res;
    } else if (req.method == 'POST') {
      const transaction = await createNFT(req.body.account);
      const response: ActionPostResponse = { transaction: transaction, message: "Minting 1 fortune for good karma..." };
      return res.status(200).json(response);;
    } else if (req.method == 'GET') {
      const response: ActionGetResponse = {
        icon: 'https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb.PNG',
        title: 'Ask the Orb',
        description: 'Hold an intention and ask the Orb for guidance and you receive a fortune in return.',
        label: 'Mint',
      }
      return res.status(200).json(response);
    }
    return res.status(500).json({ message: 'No reading generated.' });
  } catch (err) {
    return res.status(500);
  }
}
