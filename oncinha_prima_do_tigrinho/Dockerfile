FROM python:3.12.3

EXPOSE 8000

WORKDIR /app

COPY . .

RUN pip3 install -r requirements.txt

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]