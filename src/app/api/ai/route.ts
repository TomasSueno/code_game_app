// import { NextResponse } from "next/server";
// import { Mistral } from '@mistralai/mistralai';
// import dotenv from 'dotenv';

// dotenv.config();

// // Use Mistral instead of Gemini
// if (!process.env.mistralai_key) {
//   throw new Error("Missing MISTRAL_API_KEY environment variable");
// }

// const client = new Mistral({
//   apiKey: process.env.mistralai_key,
// });

// async function callMistralAPI(fullPrompt: string) {
//   try {
//     const response = await client.chat.complete({
//       model: 'mistral-large-latest',
//       messages: [{ role: 'user', content: fullPrompt }],
//     });

//     return response.choices[0].message.content;
//   } catch (error: any) {
//     throw new Error(`Mistral API error: ${error.message}`);
//   }
// }

// export async function GET() {
//   const res = await fetch(
//     "https://api.mistral.ai/v1/models",
//     {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${process.env.mistralai_key}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const data = await res.json();
//   // Return all models from Mistral
//   return NextResponse.json({ models: data.data });
// }

// export async function POST(req: Request) {
//   try {
//     const { code } = await req.json();

//     if (!code) {
//       return NextResponse.json({ evaluation: "No code provided" }, { status: 400 });
//     }

//     // 3. Better prompt structure with markdown delimiters
//     const prompt = `Zhodnoť nasledujúci kód z pohľadu EFEKTIVITY PRE BIZNIS.

// Kontext:
// - Projekt: MVP
// - Jazyk: Python
// - Rast: stredný

// Hodnoť:
// 1) výpočtovú efektivitu
// 2) efektivitu úprav
// 3) prevádzkové náklady
// 4) riziká o 6 mesiacov

// Pre každé:
// - stav: nízka / stredná / vysoká
// - 1 veta vysvetlenia
// - 1 veta dopadu (čas / peniaze / riziko)

// Na konci:
// - top 3 problémy
// - top 3 odporúčania podľa návratnosti

// Používaj jednoduchý jazyk, žiadny žargón.\n\n\`\`\`\n${code}\n\`\`\``;
    
//     const evaluation = await callMistralAPI(prompt);

//     return NextResponse.json({ evaluation });
//   } catch (err: any) {
//     console.error("Mistral API error:", err);
//     return NextResponse.json(
//       { evaluation: `Chyba pri volaní Mistral: ${err.message}` },
//       { status: 500 }
//     );
//   }
// }
