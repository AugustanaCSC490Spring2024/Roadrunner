---
title: "How to make AI personalized?"
excerpt: "Explore how Roadrunner leverages OpenAI's API to generate and utilize text embeddings, enhancing our wearable AI's capabilities while navigating the challenges of modern AI technologies."
coverImage: "/assets/blog/llm-embeddings/embedding.webp"
date: "2024-05-20T17:25:41.964Z"
author:
  name: Hung Tran
ogImage:
  url: "/assets/blog/llm-embeddings/embedding.webp"
---

At Roadrunner, our commitment to integrating cutting-edge AI technology into everyday life is unwavering. A pivotal component of our wearable AI technology involves the sophisticated use of text embeddings, generated through OpenAI's powerful API. This process allows us to transform plain text into a numerical form that our systems can understand and analyze, paving the way for a myriad of functionalities from personalized content delivery to enhanced interaction capabilities.

### Utilizing OpenAI's API for Text Embeddings

Our system taps into the OpenAI API to generate embeddings for any given text. These embeddings are essentially high-dimensional vectors that capture the semantic essence of the text, enabling our AI to comprehend and process user inputs at a deeply nuanced level. The generate_embeddings function within our LLMClient class is specifically designed for this purpose, leveraging the "text-embedding-ada-002" model to ensure we obtain high-quality embeddings.

```python:
def generate_embeddings(self, text):
    try:
        response = self.client.embeddings.create(
            model="text-embedding-ada-002", input=text
        )
        embeddings = response.data[0].embedding if response.data else None
        if embeddings is None:
            raise ValueError("No embeddings generated")
        return embeddings
    except Exception as e:
        print(f"An error occurred while generating embeddings: {e}")
        return None
```

### Storing and Utilizing Embeddings

Once generated, these embeddings are stored in our database, as managed by the embeddings.py module. This allows us to maintain a rich repository of vectorized text data associated with each user, which can be used for various applications such as content recommendation or contextual understanding in conversations. The function get_relevant_records plays a crucial role here, employing cosine similarity to find and retrieve records that are contextually similar to a user's current input.

```python:
async def get_relevant_records(db: Session, user_id, last_message_content, threshold=0.2):
    query_vector = llm_client.generate_embeddings(last_message_content)
    embeddings_records = crud.get_all_embeddings_by_user(db, user_id)
    relevant_records = []
    for record in embeddings_records:
        similarity = cosine_similarity(query_vector, record.vector)
        if similarity > threshold:
            relevant_records.append(record)
    return relevant_records
```

### Challenges and Limitations

Despite the robust capabilities provided by OpenAI's embeddings, we face several challenges:

1. Hallucination in AI Outputs: One of the more perplexing issues with current AI models, including those used for generating embeddings, is their tendency to "hallucinate" — generate plausible but incorrect or irrelevant information. This can be particularly challenging when ensuring the accuracy and relevance of AI-generated content.
2. Personalization: While embeddings provide a powerful tool for understanding content, tailoring this understanding to individual user preferences and contexts remains a complex challenge. Ensuring that our AI can adapt to the unique nuances of each user's interaction style and history is an ongoing area of development.
3. Limitations of Cosine Similarity: While cosine similarity is effective for measuring the closeness of two vectors, it doesn't always capture the complexity of human language nuances. Different contexts or subtle shifts in meaning that humans can easily discern might not be as apparent to an AI using cosine similarity.

### Looking Forward

As we continue to refine our use of AI and embeddings, our focus remains on enhancing the accuracy, personalization, and responsiveness of our wearable AI technologies. We are actively researching ways to mitigate the effects of hallucination, improve our personalization algorithms, and develop more sophisticated methods for semantic similarity that go beyond traditional approaches like cosine similarity.
