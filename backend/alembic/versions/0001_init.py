"""init v3
Revision ID: 0001_init
Revises:
Create Date: 2026-03-05
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision="0001_init"
down_revision=None
branch_labels=None
depends_on=None

def upgrade():
    op.create_table("users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("phone", sa.String(length=32), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("city", sa.String(length=120), nullable=True),
        sa.Column("language", sa.String(length=8), nullable=False, server_default="fr"),
        sa.Column("role", sa.String(length=16), nullable=False, server_default="user"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_users_phone","users",["phone"],unique=True)

    op.create_table("otp_codes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("phone", sa.String(length=32), nullable=False),
        sa.Column("code_hash", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_otp_phone","otp_codes",["phone"],unique=False)

    op.create_table("refresh_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("jti", sa.String(length=64), nullable=False),
        sa.Column("revoked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_refresh_jti","refresh_tokens",["jti"],unique=True)

    op.create_table("lessons",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("chapter", sa.String(length=100), nullable=False),
        sa.Column("media_url", sa.String(length=500), nullable=True),
        sa.Column("content_md", sa.Text(), nullable=False),
        sa.Column("reading_time_min", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="published"),
    )

    op.create_table("questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("theme", sa.String(length=100), nullable=False),
        sa.Column("difficulty", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("stem", sa.Text(), nullable=False),
        sa.Column("media_url", sa.String(length=500), nullable=True),
        sa.Column("choices", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("answer", sa.String(length=4), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="published"),
    )

    op.create_table("mock_exams",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("question_ids", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("score", sa.Float(), nullable=True),
        sa.Column("duration_sec", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("breakdown", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table("centers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("lat", sa.Float(), nullable=False),
        sa.Column("lng", sa.Float(), nullable=False),
        sa.Column("instructions", sa.Text(), nullable=True),
    )

    op.create_table("slots",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("center_id", sa.Integer(), sa.ForeignKey("centers.id"), nullable=False),
        sa.Column("dt_utc", sa.DateTime(), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False, server_default="20"),
        sa.Column("booked", sa.Integer(), nullable=False, server_default="0"),
    )

    op.create_table("bookings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("slot_id", sa.Integer(), sa.ForeignKey("slots.id"), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="confirmed"),
        sa.Column("pdf_path", sa.String(length=500), nullable=True),
        sa.Column("qr_data", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table("payments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("provider", sa.String(length=32), nullable=False),
        sa.Column("amount_fcfa", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="created"),
        sa.Column("reference", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_payments_reference","payments",["reference"],unique=True)

def downgrade():
    op.drop_index("ix_payments_reference", table_name="payments")
    op.drop_table("payments")
    op.drop_table("bookings")
    op.drop_table("slots")
    op.drop_table("centers")
    op.drop_table("mock_exams")
    op.drop_table("questions")
    op.drop_table("lessons")
    op.drop_index("ix_refresh_jti", table_name="refresh_tokens")
    op.drop_table("refresh_tokens")
    op.drop_index("ix_otp_phone", table_name="otp_codes")
    op.drop_table("otp_codes")
    op.drop_index("ix_users_phone", table_name="users")
    op.drop_table("users")
