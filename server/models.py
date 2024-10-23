from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from enum import Enum

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)  
    role = db.Column(db.String)

    # Relationships 
    voter = db.relationship('Voter', back_populates='user')

    # #serialize rules
    serialize_rules=('-voter.user','-candidate.user','-password')
# 
# 
class Voter(db.Model, SerializerMixin):
    __tablename__ = 'voters'

    id = db.Column(db.Integer, primary_key=True)
    national_id = db.Column(db.Integer, unique=True)
    registration_date = db.Column(db.DateTime, default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    county_id = db.Column(db.Integer, db.ForeignKey('counties.id'))
    constituency_id = db.Column(db.Integer, db.ForeignKey('constituencies.id'))
    ward_id = db.Column(db.Integer, db.ForeignKey('wards.id'))
# 
    # Relationships 
    user = db.relationship('User', back_populates='voter')
    county = db.relationship('County', back_populates='voters')
    constituency = db.relationship('Constituency', back_populates='voters')
    ward = db.relationship('Ward', back_populates='voters')
    candidate = db.relationship('Candidate', back_populates='voter')
    vote=db.relationship("Vote",back_populates="voter")
    # votes = db.relationship('Vote', back_populates='voter')
    #serialize rules
    serialize_rules=("-user.voter",'-user.id','-user.role','-user.email','-county.wards','-county.constituencies','-county.voters','-county_id','-ward_id',
                     '-user_id','-constituency_id','-county.id','-ward.voters',
                     '-ward.county','-ward.constituency','-ward.constituency_id','-ward.id','-ward.county_id',
                      '-constituency.county_id','-constituency.voters','-constituency.county','-constituency.wards','-constituency.id',
                      '-candidate.voter','-vote.voter'
                      )

class Candidate(db.Model, SerializerMixin):
    __tablename__ = 'candidates'
    
    id = db.Column(db.Integer, primary_key=True)
    # votes_received = db.Column(db.Integer, default=0)
    position = db.Column(db.String)
    voter_id = db.Column(db.Integer, db.ForeignKey('voters.id'))
    election_id = db.Column(db.Integer, db.ForeignKey("elections.id"))
    region = db.Column(db.String)
    
    # New columns
    party = db.Column(db.String)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    
    # Relationships 
    voter = db.relationship('Voter', back_populates='candidate')
    election = db.relationship("Election", back_populates="candidates")
    votes = db.relationship('Vote', back_populates='candidate')
    
    # Serialise rules
    serialize_rules = ('-user.candidate', '-voter.candidate', "-election.candidates", "-votes.candidate",'-election.votes')


#County model
class County(db.Model, SerializerMixin):
    __tablename__ = 'counties'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    #relationships
    constituencies=db.relationship('Constituency',back_populates='county')
    wards=db.relationship("Ward",back_populates='county')
    voters = db.relationship('Voter', back_populates='county')
    #serialize_rules
    serialize_rules=('-constituencies.county','-wards.county','-voters','-constituencies.wards',
                     '-constituencies.county_id','-constituencies.id','-wards.constituency',
                     '-wards.constituency_id','-wards.county_id','-wards.id')
# 
# Constituency model
class Constituency(db.Model, SerializerMixin):
    __tablename__ = 'constituencies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    #relationships
    county_id = db.Column(db.Integer, db.ForeignKey('counties.id'))
    voters = db.relationship('Voter', back_populates='constituency')
    county=db.relationship('County',back_populates='constituencies')
    wards=db.relationship("Ward",back_populates='constituency')
    #serialize rules
    serialize_rules=('-county.constituencies','-wards.constituency','-county.wards',
                     '-voters','-county_id','-wards.constituency_id','-wards.county_id',
                     '-wards.county','-wards.id')
# 
# Ward model
class Ward(db.Model, SerializerMixin):
    __tablename__= 'wards'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    #relationships
    county_id=db.Column(db.Integer,db.ForeignKey('counties.id'))
    constituency_id = db.Column(db.Integer, db.ForeignKey('constituencies.id'))
    county=db.relationship("County",back_populates='wards')
    constituency=db.relationship("Constituency",back_populates='wards')
    voters = db.relationship('Voter', back_populates='ward')
    #serialize rules
    serialize_rules=('-county.wards','-county.constituencies','-constituency.wards','-constituency.county','-constituency.county_id',
                     '-voters','-constituency_id','-county_id')
    


class Election(db.Model,SerializerMixin):
    __tablename__="elections"

    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String)
    type=db.Column(db.String)
    # type=db.Column(SQLAlchemyEnum(Election_Types)) #make it an enumeration
    status=db.Column(db.String)
    date=db.Column(db.DateTime)
    election_date=db.Column(db.String)
    region=db.Column(db.String)
    #relationships
    candidates=db.relationship("Candidate",back_populates="election")
    votes=db.relationship("Vote",back_populates="election")
    #serialize rules
    serialize_rules=("-candidates.election",'-votes.election')



#votes model
class Vote(db.Model,SerializerMixin):
    __tablename__="votes"

    id=db.Column(db.Integer,primary_key=True)
    candidate_id=db.Column(db.Integer,db.ForeignKey('candidates.id'))
    election_id=db.Column(db.Integer,db.ForeignKey('elections.id'))
    voter_id=db.Column(db.Integer,db.ForeignKey('voters.id'))
    #relationships
    candidate=db.relationship("Candidate",back_populates="votes")
    election=db.relationship("Election",back_populates='votes')
    voter=db.relationship("Voter", back_populates="vote")
    #serialize rules
    serialize_rules=('-candidate','-election','-voter')

































# Position model
# class Position(db.Model, SerializerMixin):
    # __tablename__ = 'positions'
# 
    # id = db.Column(db.Integer, primary_key=True)
    # name = db.Column(db.String)
    # candidates = db.relationship('Candidate', back_populates='position')
# 
# 
# Vote model
# class Vote(db.Model, SerializerMixin):
    # __tablename__ = 'votes'
# 
    # id = db.Column(db.Integer, primary_key=True)
    # vote_date = db.Column(db.DateTime, default=db.func.now())
    # voting_status = db.Column(db.Boolean, default=False)
    # voter_id = db.Column(db.Integer, db.ForeignKey('voters.id'))
    # position_id = db.Column(db.Integer, db.ForeignKey('positions.id'))
    # candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'))
# 
    # Relationships
    # voter = db.relationship('Voter', back_populates='votes')
    # position = db.relationship('Position', back_populates='votes')
    # candidate = db.relationship('Candidate', back_populates='votes')
# 
# # 