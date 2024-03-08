"""Removed chart avg column

Revision ID: 55078556cce0
Revises: 5259da39419f
Create Date: 2024-03-04 20:50:10.035247

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '55078556cce0'
down_revision = '5259da39419f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('daily_charts', schema=None) as batch_op:
        batch_op.drop_column('chart_avg_rating')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('daily_charts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('chart_avg_rating', sa.FLOAT(), nullable=False))

    # ### end Alembic commands ###