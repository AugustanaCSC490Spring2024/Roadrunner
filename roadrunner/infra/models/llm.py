from litellm import completion
from ..prompts import summary_prompt
import os

class LLMClient:
    def __init__(self):
        # self.api_key = os.getenv("OPENAI_API_KEY")
        self.api_key = "DUMMY_API"
        if not self.api_key:
            raise ValueError(
                "API key not found. Please set the OPENAI_API_KEY environment variable."
            )
        print(self.api_key)
        self.conversation = [
            {"role": "system", "content": summary_prompt()},
        ]
    def add_message(self, role: str, content: str):
        self.conversation.append({"role": role, "content": content})
    
    def generate_completion(self, user_message):
        self.add_message("user", user_message)
        print(self.conversation)
        response = completion(model="gpt-3.5-turbo", messages=self.conversation, api_key=self.api_key)
        return response.get('choices', [{}])[0].get('message', {}).get('content', 'No response generated')

    
if __name__ == "__main__":
    client = LLMClient()
    print(client.generate_completion("Test input"))