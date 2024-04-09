Welcome to Roadrunner project!

We are building an AI wearable device

## Project Structure

The Roadrunner project is structured into several key components, ensuring a clean separation of concerns and scalability. Here's an overview:

- `roadrunner/`: The main directory for our project.
  - `infra/`: Contains infrastructure-related code, including database models, API routes, and external service clients.
    - `db/`: Database models, CRUD operations, and session management.
    - `models/`: Definitions for our domain models and external service clients, such as the LLMClient for interacting with language models.
    - `routes/`: FastAPI routes that define the endpoints of our API.
  - `tests/`: Unit and integration tests for our application.
  - `client`: Our client code (mobile app)
- `blog`: Source code for our blog

## Usage

### API

Our infra exposes several APIs. Recommend using Postman

- **Chat API (`/chat`)**: Allows users to send chat messages and receive responses from our AI assistant. Example using `curl`:

```bash
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"message": "Hello, World!"}'
```

To upload an audio file for processing, use the `/audio` endpoint with a form-data body containing the `audio` file and `user_id`. Example using `curl`:

```bash
curl -X POST -F "audio=@./roadrunner/tests/data/audio/test_session.wav" http://127.0.0.1:8000/audio
```

### Running the Project

To run the Roadrunner project locally, clone the repository, navigate to the project directory, and install the dependencies:

```bash
pip install -r requirements.txt
```

Create virtual environment
```
python3 -m venv venv
source venv/bin/activate
```

Then, start the FastAPI server in root directory:

```bash
export OPENAI_API_KEY='your_open_ai_api_key'
uvicorn roadrunner.infra.main:app --reload
```

## Technology Used

- **FastAPI**: For building our efficient and easy-to-use RESTful APIs.
- **SQLAlchemy**: As our ORM for interacting with the database.
- **Pydantic**: For data validation and settings management.
- **OpenAI's GPT**: Leveraged through our `LLMClient` for generating conversational AI responses.

## Workflow Explanation

The workflow from the recording device to the client involves several key steps:

1. **Recording**: The user records a message or input through a device.
2. **Processing**: The recorded audio is processed and converted into metadata (e.g., text transcription, embeddings).
3. **API Request**: The processed audio is sent to our `/audio` API endpoint as a JSON payload.
4. **AI Processing**: The `LLMClient` uses the input to generate a response, potentially leveraging stored embeddings and database records to enhance the response.
5. **Client's Conversation**: Interact through `/chat`.
6. **Response**: The generated response is sent back to the client, completing the interaction loop.

## Links

- Blog: [https://roadrunner-csc490.vercel.app/](https://roadrunner-csc490.vercel.app/)
