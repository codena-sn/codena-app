"""user profile fields (onboarding progressif)
Revision ID: 0002_user_profile
Revises: 0001_init
Create Date: 2026-07-12
"""
from alembic import op
import sqlalchemy as sa

revision = "0002_user_profile"
down_revision = "0001_init"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("first_name", sa.String(length=120), nullable=True))
    op.add_column("users", sa.Column("exam_goal", sa.String(length=32), nullable=True))
    op.add_column("users", sa.Column("referral_source", sa.String(length=64), nullable=True))
    op.add_column("users", sa.Column("marketing_consent", sa.Boolean(), nullable=False, server_default=sa.text("false")))
    op.add_column("users", sa.Column("marketing_consent_at", sa.DateTime(), nullable=True))
    op.add_column("users", sa.Column("profile_completed_at", sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column("users", "profile_completed_at")
    op.drop_column("users", "marketing_consent_at")
    op.drop_column("users", "marketing_consent")
    op.drop_column("users", "referral_source")
    op.drop_column("users", "exam_goal")
    op.drop_column("users", "first_name")
