from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from app.models import Base  # Import your models
from alembic import context
import os
from dotenv import load_dotenv # type: ignore

# Load environment variables from .env file
load_dotenv()
url = os.getenv("DATABASE_URL")  # Fetches the DATABASE_URL directly

# Alembic Config object for configuration and logging
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set up target metadata for autogeneration
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode using the environment's DATABASE_URL."""

    # Use the `url` from .env instead of `alembic.ini`
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode using an Engine with the environment's DATABASE_URL."""

    connectable = engine_from_config(
        {"sqlalchemy.url": url},  # Set the sqlalchemy.url dynamically
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


# Determine if running offline or online migrations
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
