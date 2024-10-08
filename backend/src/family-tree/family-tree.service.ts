import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

@Injectable()
export class FamilyTreeService {

    openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY,
        });
    }

    async getFamilyTree(description: string) {

        const ResearchPaperExtraction = z.object({
            message: z.string(),
            isValidFamilyDescription: z.boolean(),
            tree: z.array(z.object({
                node: z.string(),
                parents: z.array(z.string()),
                relationNameWithUser: z.string(),
                gender: z.string()
            })),
        });

        const response = await this.openai.beta.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `
                            You are an assistant specialized in generating family trees based on provided textual descriptions. Follow these guidelines:

                            1. Hierarchy: 
                                a. Parse the description to identify family members and their relationships.
                                b. Start the tree with the highest generation mentioned and work downwards to the younger generations.
                            2. Default Assumptions:
                                a. If a relationship is described without specifying maternal or paternal sides, assume it is paternal by default.
                                b. Indicate this assumption in the family tree by placing unspecified relationships on the father's side.
                            3. Representation:
                                a. Use 'You' to represent the person requesting the family tree.
                            4. Handling In-Law Relationships:
                                a.For any in-law relationship mentioned (e.g., father-in-law, mother-in-law), link these individuals to the corresponding spouse.
                                b. Specifically:
                                - Father-in-law and mother-in-law should be linked as the father and mother of the spouse (e.g., David's parents, not "Your" direct parents).
                                c. Ensure that in-law relationships are not directly linked to "You" but instead to "You"'s spouse.
                            5. Spousal Relationships:
                                a. Ensure that any spouse mentioned (e.g., husband or wife) is correctly linked to "You".
                                b. If the spouse has parents (in-laws), make sure they are linked as the parents of the spouse, not "You".
                            6. Clarification:
                                a. If the description is unclear or contradictory, provide feedback and ask for clarification.
                    `
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

        return familyTree;
    }
}
