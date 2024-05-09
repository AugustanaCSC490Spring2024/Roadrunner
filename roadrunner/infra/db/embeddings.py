import numpy as np
from sqlalchemy import func
from sqlalchemy.orm import Session

from infra.models.llm import LLMClient
from infra.utils import logger

from .models import Embedding

llm_client = LLMClient()
log = logger.get_logger(__name__)


def cosine_similarity(v1, v2):
    """Calculate cosine similarity between two vectors."""
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    return dot_product / (norm_v1 * norm_v2)


async def get_relevant_records(db: Session, last_message_content, threshold=0.1):
    query_vector = llm_client.generate_embeddings(last_message_content)
    # log.info(f"Query vector: {query_vector}")

    embeddings_records = db.query(Embedding).all()

    relevant_records = []
    for record in embeddings_records:
        # log.info(f"Record vector: {record.vector}")
        similarity = cosine_similarity(query_vector, record.vector)
        if similarity > threshold:
            relevant_records.append(record.text)

    # log.info(f"Relevant records: {relevant_records}")

    return relevant_records
