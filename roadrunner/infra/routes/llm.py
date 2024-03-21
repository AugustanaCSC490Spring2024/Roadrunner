from flask import Blueprint, request, jsonify
from ..models.llm import LLMClient

llm = Blueprint('llm', __name__)

llm_client = LLMClient()

@llm.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    user_message = data.get("message")
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    print(f"Received message: {user_message}")
    
    try:
        summary = llm_client.generate_completion(user_message)
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500