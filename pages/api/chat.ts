// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

type Data = {
  text?: string;
  error?: string;
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Ensure you have your API key in the environment variables

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { prompt, reading } = req.body;

  console.log(prompt, reading);
  if (!prompt && !reading) {
    return res.status(400).json({ error: 'Either prompt or reading is required' });
  }

  try {
    // Create a thread
    const thread = await client.beta.threads.create();

    // Add user message to the thread
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `The user is inquiring about ${prompt}\n\n and received I Ching reading: ${JSON.stringify(reading)}`
    });

    // Run the assistant
    let run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_8FnpPXzdQLjLXYxuK0Xx1iLu'
    });

    // Polling for run completion
    while (run.status !== 'completed') {
      if (run.status === 'failed') {
        console.log(run);
        res.status(500).json({ error: 'Assistant run failed' });
      }
      console.log(run.status);
      await new Promise(resolve => setTimeout(resolve, 2000));
      run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the messages from the thread
    const messages = await client.beta.threads.messages.list(thread.id, {
      order: "asc"
    });

    console.log(run);
    // Extract the response text
    let responseText = '';
    for (const message of messages.data) {
      for (const content of message.content) {
        if (content.type === 'text') {
          responseText += content.text.value;
        }
      }
    }

    res.status(200).json({ text: responseText });
  } catch (error) {
    console.error("Error creating assistant:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
