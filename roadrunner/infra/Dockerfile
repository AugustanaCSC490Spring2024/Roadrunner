FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . /app/infra


ENV OPENAI_API_KEY='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'

EXPOSE 5000

CMD ["uvicorn", "infra.main:app"]