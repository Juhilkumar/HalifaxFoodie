FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
ENV FLASK_APP=main
ENV PORT=8080
COPY . .

CMD [ "python", "-m" , "flask", "run", "--host=0.0.0.0","--port=8080"]