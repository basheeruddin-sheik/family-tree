import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAI } from 'openai';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("llm")
  async check(@Body("description") description: string) {
    try {
      const openai = new OpenAI({
        apiKey: "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",
      });

      const ResearchPaperExtraction = z.object({
        message: z.string(),
        tree: z.array(z.object({
          node: z.string(),
          parents: z.array(z.string()),
          relationDescription: z.string(),
          // relationStartsWith: z.string(),
          gender: z.string(),
        })),
      });

      const response = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an assistant specialized in generating family trees based on provided textual descriptions. 
                      Only construct the family tree using the explicit information given, without making any assumptions or adding details not included in the description. 
                      Start the tree with the highest generation mentioned and work downwards. 
                      If a relationship or connection is unclear, omit it rather than speculating. Mention 'You' as the person who is requesting the family tree. 
                      Ensure accuracy and clarity in the tree structure.
                      If the description includes complex or overlapping relationships, ensure these are presented clearly within the constraints of the information provided.
                      The goal is to provide a precise and clean visual representation of the family lineage as described.`,
          },
          {
            role: 'user',
            content: `Create a structured family tree from the following description: ${description}`,
          },
        ],
        response_format: zodResponseFormat(ResearchPaperExtraction, "research_paper_extraction"),
      });
  
      // console.log(JSON.stringify(response, null, 2));
      const familyTree = response.choices[0].message?.parsed;

      console.log("familyTree", response?.choices[0]?.message?.content)
      return {familyTree}
    } catch (error) {
      console.log("error", error)
    }
  }
}
