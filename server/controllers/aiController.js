
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import FormData from "form-data";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit reached. Upgrade to continue."
            });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-3.7-flash",
            messages: [
                {
                    role: "user",
                    content: `${prompt}

Write a complete ${length}-word article in Markdown.
Include a title, introduction, relevant headings, informative paragraphs, and a conclusion.
Be concise and avoid unnecessary repetition.
Return only the article.`
                }
            ],
            temperature: 0.7,
            max_tokens: 2500,
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'article')
        `;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

        res.json({
            success: true,
            content
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        });
    }
};

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit reached. Upgrade to continue."
            });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-3.7-flash",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 800
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
        `;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

        res.json({
            success: true,
            content
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        });
    }
};


export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "This feature is only available for premium subscriptions"
            });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        const response = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer'
            }
        );

        console.log("CLIPDROP IMAGE RECEIVED");

        const base64Image = `data:image/png;base64,${Buffer.from(
            response.data
        ).toString('base64')}`;

        // Save Base64 temporarily in database
        await sql`
            INSERT INTO creations (user_id, prompt, content, type, publish)
            VALUES (
                ${userId},
                ${prompt},
                ${base64Image},
                'image',
                ${publish ?? false}
            )
        `;

        res.json({
            success: true,
            content: base64Image
        });

    } catch (error) {
        console.log("========== IMAGE ERROR ==========");
        console.log("MESSAGE:", error.message);
        console.log("================================");

        res.json({
            success: false,
            message: error.message
        });
    }
};

export const removeImageBackground = async (req, res) => {
    try {
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "This feature is only available for premium subscriptions"
            });
        }

        const formData = new FormData();

        formData.append(
            'image_file',
            fs.createReadStream(image.path)
        );

        const response = await axios.post(
            'https://clipdrop-api.co/remove-background/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer'
            }
        );

        console.log("CLIPDROP BACKGROUND REMOVED");

        const base64Image = `data:image/png;base64,${Buffer.from(
            response.data
        ).toString('base64')}`;

        res.json({
            success: true,
            content: base64Image
        });

    } catch (error) {
        console.log("BACKGROUND REMOVAL ERROR:", error.message);

        res.json({
            success: false,
            message: error.message
        });
    }
};

export const removeImageObject = async (req, res) => {

    try {

        const image = req.files?.image?.[0];
        const mask = req.files?.mask?.[0];

        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "This feature is only available for premium subscriptions"
            });
        }

        if (!image || !mask) {
            return res.json({
                success: false,
                message: "Image and mask are required"
            });
        }

        const formData = new FormData();

        formData.append(
            'image_file',
            fs.createReadStream(image.path)
        );

        formData.append(
            'mask_file',
            fs.createReadStream(mask.path)
        );

        formData.append('mode', 'quality');

        const response = await axios.post(
            'https://clipdrop-api.co/cleanup/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer'
            }
        );

        const base64Image =
            `data:image/png;base64,${Buffer.from(
                response.data
            ).toString('base64')}`;

        res.json({
            success: true,
            content: base64Image
        });

    } catch (error) {

        console.log(
            "REMOVE OBJECT ERROR:",
            error.response?.data || error.message
        );

        res.json({
            success: false,
            message: error.message
        });
    }
};

export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        
        const plan = req.plan;
        

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "This feature is only awailable for premium subscriptions"
            });
        }

        if(resume.size > 5*1024*1024){
            return res.json({success:false, message:"Resume file size exceeds allowed size(5MB)."})
        }

        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData = await pdf(dataBuffer)
 const prompt = `
Review this resume and give a moderately detailed, actionable review.

Cover:
- Overall impression
- 3-4 key strengths
- 3-4 weaknesses
- Projects and their descriptions
- Technical skills
- Education and experience
- Important improvements
- Final score /10 with a short reason

Give around 15-20 lines of useful feedback.
Use clean Markdown with headings and bullet points.
Keep each point short and specific.
Do not create empty bullets or invent any information.
Only use information available in the resume.
If something is missing, mention that it is missing.

Resume:
${pdfData.text}
`;

         const response = await AI.chat.completions.create({
    model: "gemini-3.7-flash",
    messages: [
      
        {
            role: "user",
            content: prompt,
        },

    ],

    temperature:0.7,
    max_tokens: 2000,
});

const content = response.choices[0].message.content

await sql`INSERT INTO creations (user_id, prompt, content, type)
VALUES (${userId},'Review the uploaded resume', ${content}, 'resume-review')`;

res.json({ success: true, content});

    } catch (error) {
       console.log(error.message)
       res.json({success: false,message: error.message})
    }
}