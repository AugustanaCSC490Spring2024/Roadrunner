FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . /app

COPY main.py .


EXPOSE 5000
CMD ["python", "main.py"]