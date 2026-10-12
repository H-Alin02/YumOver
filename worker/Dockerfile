# Minimal Linux image with Python 3.14 already installed
FROM python:3.14-slim

# Set /app as the working directory inside the container
WORKDIR /app

# Copy the uv binary into the image
COPY --from=ghcr.io/astral-sh/uv:0.12.6 /uv /uvx /bin/

# Copy the worker files
COPY . .

# Install the project dependencies, without the dev group
RUN uv sync --frozen --no-dev

# Put the .venv programs first in PATH
ENV PATH="/app/.venv/bin:$PATH"

# Create an unprivileged user
RUN useradd --create-home appuser
USER appuser

# Start the worker when the container starts
CMD ["worker"]