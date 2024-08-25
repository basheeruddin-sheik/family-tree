# Family Tree Generator

This application leverages advanced large language model(LLM) to transform user-provided descriptions of family relationships into visually appealing interactive family trees.


## Technologies
* Backend: NestJS
* Frontend: React


## Installation & Start Services
1. Clone this repository:
   ```
   git clone https://github.com/basheeruddin-sheik/family-tree.git
   ```
2. Change Directory
    ```
    cd family-tree
    ```
3. Backend: Run below commands from root directory
    1. Change Directory
        ```
        cd backend
        ```
    2. Install Dependencies
        ```
        npm install
        ```
    3. Create .env file and run below bash command
        ```
        cp .env.example .env
        ``` 
    4. Run Service
        ```
        npm run start:dev
        ```

4. Frontend: Run below commands from root directory
    1. Change Directory
        ```
        cd frontend
        ```
    2. Install Dependencies
        ```
        npm install
        ```
    3. Run Service
        ```
        npm start
        ```

## API Endpoints
1. FamilyTreeController
    * ```family-tree/generate - POST``` Generate the family
        ```
        // Response Format
        {
            message: string;
            tree: {
                node: string;
                parents: string[];
                relationNameWithUser: string;
                gender: string;
            }[];
        }
        ```

## TODOs
1. Refine the prompt by examining various examples with intricate family relationships to get more accuracy.
2. Fine-tune the model for this specific use case by providing a dataset related to relationships.
3. Will use Langchain chunking process for splitting large inputs into smaller, manageable parts to fit within the token limit of language models while preserving the context and coherence of the information.
4. Implement authentication & API authorization.