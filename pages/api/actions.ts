// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

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

export interface ActionError {
    /** non-fatal error message to be displayed to the user */
    message: string;
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
  
  
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActionGetResponse>,
) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Content-Encoding', 'compress');
  res.setHeader('Content-Type', 'application/json');

    res.status(200).json({ 
        "title": "Orb Reading",
        "icon": "https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb2.PNG",
        "description": "Ask the Orb with your SOL to get a reading. May Fortune favor you. Donate to support.",
        "label": "Ask",
        "links": {
            "actions": [
            {
                "label": "Get Reading", // button text
                "href": "/api/mint"
            },
            {
                "label": "Fortune Favors", // button text
                "href": "/api/hello"
            },
            {
                "label": "Donate", // button text
                "href": "/api/hello/{amount}", // or /api/donate?amount={amount}
                "parameters": [
                  // {amount} input field
                  {
                    "name": "amount", // input field name
                    "label": "SOL amount" // text input placeholder
                  }
                ]
              }
            ]
        }
     });
}
