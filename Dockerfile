FROM python:3.13.5
RUN mkdir /app


ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt  /app/

RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

