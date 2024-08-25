import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { FamilyTreeService } from './family-tree.service';


@Controller('family-tree')
export class FamilyTreeController {

    constructor(private familyTreeService: FamilyTreeService) {}


    @Post("generate")
    async check(@Body("description") description: string) {
        try {
            if(!description?.length) {
                throw new HttpException("Description is required", HttpStatus.BAD_REQUEST);
            }

            const familyTree = await this.familyTreeService.getFamilyTree(description);

            return familyTree;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
