import numpy as np
from infra.db import crud
from infra.models.llm import LLMClient
from infra.utils import logger
from sqlalchemy import func
from sqlalchemy.orm import Session

from .models import Embedding

llm_client = LLMClient()
log = logger.get_logger(__name__)


def cosine_similarity(v1, v2):
    """Calculate cosine similarity between two vectors."""
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    return dot_product / (norm_v1 * norm_v2)


async def get_relevant_records(
    db: Session, user_id, last_message_content, threshold=0.2
):
    query_vector = llm_client.generate_embeddings(last_message_content)
    # log.info(f"Query vector: {query_vector}")

    embeddings_records = crud.get_all_embeddings_by_user(db, user_id)

    relevant_records = []
    for record in embeddings_records:
        # log.info(f"Record vector: {record.vector}")
        similarity = cosine_similarity(query_vector, record.vector)
        if similarity > threshold:
            relevant_records.append(record)

    # log.info(f"Relevant records: {relevant_records}")

    return relevant_records
