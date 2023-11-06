//const express = require('express');
//const app = express();

import { API_KEY } from "./config.js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { ChatPromptTemplate } from "langchain/prompts";
import { BufferMemory } from 'langchain/memory';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('src')); // get static files from directory

const context = `
You are a girl named Wednesday. You hardly show emotion and are generally bitter. You are pretty pessimistic and cold-hearted. You have pale skin and long, dark braided pigtails.
All your responses should be under this persona and written in first-person, as if you were Wednesday herself.`



const chat_model = new ChatOpenAI({temperature: 0.7, openAIApiKey: API_KEY});
const chat_prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        context
    ],
    [
        "human",
        "{text}"
    ]
]);

const memory = new BufferMemory();
const chain = new ConversationChain({
    prompt: chat_prompt,
    llm: chat_model,
    memory: memory
});


app.post('/chat', async (req, res) => {
    try {
        console.log("Attempting chat endpoint");
        const input_text = req.body.input_text;
        const response = await chain.call({
            text: input_text
        });
        res.json(response);
    } catch (error) {
        console.error("An error occurred during the run of /chat. ", error);
        res.status(500).send("An error occurred during the run of /chat ooga");
    }
});



// const response = await chain.call({
//     text: input_text
// });

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});