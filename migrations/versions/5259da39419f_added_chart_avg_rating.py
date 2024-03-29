"""Added chart_avg_rating

Revision ID: 5259da39419f
Revises: 0775b9b7ade0
Create Date: 2024-02-29 01:02:32.701132

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5259da39419f'
down_revision = '0775b9b7ade0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('daily_charts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('chart_avg_rating', sa.Float(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('daily_charts', schema=None) as batch_op:
        batch_op.drop_column('chart_avg_rating')

    # ### end Alembic commands ###
