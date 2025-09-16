FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# зависимости для сборки пакетов
#RUN apt-get update \
#    && apt-get install -y --no-install-recommends \
#        gcc \
#        python3-dev \
#        libpq-dev \
#        libjpeg-dev \
#        libopenjp2-7-dev \
#        zlib1g-dev \
#    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]



