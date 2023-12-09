"""empty message

Revision ID: 88e7468090bc
Revises: 
Create Date: 2023-12-08 23:37:27.058295

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '88e7468090bc'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('therapists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=30), nullable=False),
    sa.Column('last_name', sa.String(length=35), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('clients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=30), nullable=False),
    sa.Column('last_name', sa.String(length=35), nullable=False),
    sa.Column('guardian_email', sa.String(length=255), nullable=False),
    sa.Column('therapist_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['therapist_id'], ['therapists.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('daily_charts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('discreet_trials',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('trial_date', sa.Date(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('program_name', sa.String(length=50), nullable=False),
    sa.Column('program_notes', sa.String(length=300), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('intervals',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('start_interval', sa.Time(), nullable=False),
    sa.Column('end_interval', sa.Time(), nullable=False),
    sa.Column('interval_notes', sa.String(length=300), nullable=True),
    sa.Column('interval_tags', sa.String(), nullable=True),
    sa.Column('interval_rating', sa.Integer(), nullable=False),
    sa.Column('chart_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['chart_id'], ['daily_charts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('trials',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('dt_id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('trial_target', sa.String(length=100), nullable=False),
    sa.Column('trial_count', sa.Integer(), nullable=False),
    sa.Column('trial_score', sa.Integer(), nullable=False),
    sa.Column('trial_notes', sa.String(length=300), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ),
    sa.ForeignKeyConstraint(['dt_id'], ['discreet_trials.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('trials')
    op.drop_table('intervals')
    op.drop_table('discreet_trials')
    op.drop_table('daily_charts')
    op.drop_table('clients')
    op.drop_table('therapists')
    # ### end Alembic commands ###
