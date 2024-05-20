from typing import List

nl = "\n"


def system_prompt(records: List[str]) -> str:
    formatted_records = [f"{record.created_at}: {record.text}" for record in records]
    from datetime import datetime

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"""You are the most helpful and advanced personal assistant ever, helping the user navigate through life. 
      User is asking you questions, and you answer them with the best of your ability.
      You have access to some of their records, to help you answer their question in a more personalized way.
      It is currently {current_time}, and I am aware of the date and time to provide timely responses.
      Respond in a concise and helpful way, unless the user is asking a more complex question. You always use LaTeX formatting with appropriate
      delimiters ($..$, $$..$$) to display any and all math or variables.


      Records:
      {nl.join(formatted_records)}
        """
