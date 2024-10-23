from app import app, db  # Import your app and db from your main application file
from models import User, Voter, Candidate, County, Constituency, Ward, Election, Vote
from faker import Faker
import random
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
from werkzeug.security import generate_password_hash

fake = Faker()

def seed_users(num):
    for _ in range(num):
        user = User(
            name=fake.name(),
            email=fake.email(),
            password=generate_password_hash("a123"),
            role="Voter"
        )
        db.session.add(user)
    user1=User(name="Admin Mpoa",email="admin@gmail.com", password=generate_password_hash("a123"),role="Admin")
    db.session.add(user1)
    db.session.commit()
    print(f'Inserted {num} fake users into the database!')


def seed_counties(num):
    for _ in range(num):
        county = County(
            name=fake.city() + " County"
        )
        db.session.add(county)
    db.session.commit()
    print(f'Inserted {num} fake counties into the database!')

def seed_constituencies(num):
    counties = County.query.all()
    for _ in range(num):
        constituency = Constituency(
            name=fake.city() + " Constituency",
            county_id=random.choice(counties).id
        )
        db.session.add(constituency)
    db.session.commit()
    print(f'Inserted {num} fake constituencies into the database!')

def seed_wards(num):
    constituencies = Constituency.query.all()
    for _ in range(num):
        ward = Ward(
            name=fake.city() + " Ward",
            county_id=random.choice(constituencies).county_id,
            constituency_id=random.choice(constituencies).id
        )
        db.session.add(ward)
    db.session.commit()
    print(f'Inserted {num} fake wards into the database!')

def seed_voters(num):
    users = User.query.all()

    if len(users) < num:
        print(f"Not enough users available! You have {len(users)} users but need {num}.")
        return

    unique_users = random.sample(users, num)  # Ensure unique users

    for i in range(num):
        voter = Voter(
            national_id=fake.random_int(min=10000000, max=99999999),
            user_id=unique_users[i].id,  # Assign a unique user_id
            registration_date=fake.date_time_this_decade(),
            county_id=1,  # Adjust this range based on your counties
            constituency_id=1,  # Adjust based on your constituencies
            ward_id=random.randint(1, 2)  # Adjust based on your wards
        )
        db.session.add(voter)

    db.session.commit()
    print(f'Inserted {num} fake voters into the database!')


def seed_elections(num):
    for _ in range(num):
        election = Election(
            name=fake.catch_phrase(),
            type=random.choice(['General']),
            status=random.choice(['Pending']),
            date=fake.date_time_this_decade(),
            election_date=fake.date(),
            region=fake.city()
        )
        db.session.add(election)
    db.session.commit()
    print(f'Inserted {num} fake elections into the database!')

def seed_candidates(num):
    voters = Voter.query.all()
    counties = County.query.all()  # Get all counties
    constituencies = Constituency.query.all()  # Get all constituencies
    wards = Ward.query.all()  # Get all wards

    if len(voters) < num:
        print(f"Not enough voters available! You have {len(voters)} voters but need {num}.")
        return

    unique_voters = random.sample(voters, num)  # Ensure unique voter IDs

    for i in range(num):
        # Randomly select the position for the candidate
        position = random.choice(['President', 'Governor', 'Senator', 'MP', 'MCA'])
        
        # Assign the region based on the position
        if position in ['Governor', 'Senator']:
            # Region should be a county
            region = random.choice(counties).name
        elif position == 'MP':
            # Region should be a constituency
            region = random.choice(constituencies).name
        elif position == 'MCA':
            # Region should be a ward
            region = random.choice(wards).name
        else:
            # Default to a county for positions like President (you can adjust this if needed)
            region = random.choice(counties).name

        candidate = Candidate(
            position=position,
            voter_id=unique_voters[i].id,  # Assign a unique voter_id
            election_id=1,  # Adjust this based on your elections
            region=region,  # Use the assigned region (county, constituency, or ward)
            party=fake.company(),
            description=fake.text(),
            image_url=fake.image_url()
        )
        db.session.add(candidate)

    db.session.commit()
    print(f'Inserted {num} fake candidates into the database!')




# def seed_votes(num):
#     voters = Voter.query.all()
#     candidates = Candidate.query.all()
#     for _ in range(num):
#         vote = Vote(
#             candidate_id=random.choice(candidates).id,
#             election_id=random.choice(range(1, 5)),  # Adjust based on your elections
#         )
#         db.session.add(vote)
#     db.session.commit()
#     print(f'Inserted {num} fake votes into the database!')

if __name__ == '__main__':
    with app.app_context():
        # db.drop_all()
        # db.create_all()  # Create tables if they don't exist
        seed_users(35)
        seed_counties(1)
        seed_constituencies(1)
        seed_wards(2)
        seed_voters(35)
        seed_elections(1)  # Fewer elections to associate with candidates
        seed_candidates(15)

        # seed_votes(20)  # Random votes
