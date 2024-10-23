from models import db,User,Constituency,County,Ward,Voter,Candidate,Election,Vote
from flask_migrate import Migrate
from flask import Flask, request, make_response,jsonify
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager,create_access_token, create_refresh_token,jwt_required,get_jwt_identity
import secrets,datetime,os
from datetime import timedelta
from flask_cors import CORS
from werkzeug.utils import secure_filename


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
#upload images assist
UPLOAD_FOLDER="/home/robert/Documents/projects/electro-vote-phase4-project/server/static"
ALLOWED_EXTENSIONS=set(['png','jpeg','jpg'])
def allowed_file(filename):
    return '.' in filename and filename.rsplit(".",1)[1].lower() in ALLOWED_EXTENSIONS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] =secrets.token_hex(32)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)  
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)  
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER


migrate = Migrate(app, db)

db.init_app(app)
api=Api(app)
bcrypt = Bcrypt(app)
jwt=JWTManager(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"])


class Upload_Files(Resource):
    def post(self):
        if 'file' not in request.files:
            return make_response({"error":["media file not found"]},400)
        file=request.files['file']
        if file.name=='':
            return make_response({"error":["No file selected"]},400)
        if file and allowed_file(file.filename):
            filename=secure_filename(file.filename)
            file_path=os.path.join(app.config["UPLOAD_FOLDER"],filename)
            file.save(file_path)
            return make_response({"file_path":filename},200)
api.add_resource(Upload_Files, '/uploads')
class Refresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        id=get_jwt_identity()
        new_access_token=create_access_token(identity=id)
        print(new_access_token)
        return jsonify(access_token=new_access_token),200
api.add_resource(Refresh,'/refresh')

class Signup(Resource):
    def post(self):
        data=request.get_json()
        email=data['email']
        password=data['password']
        name=data['name']
        role='Voter'
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        if '@' in email and name!='' and name!=' ':
            user=User.query.filter_by(email=email).first()
            if user:
                return make_response({"error":[f"{email} is already registered as a user. Proceed to login"]},404)
            new_user=User(name=name,email=email, password=hashed_password, role=role)
            if new_user:
                db.session.add(new_user)
                db.session.commit()
                return make_response(new_user.to_dict(),201)
        else:
            return make_response({"error":["validation errors"]},400)
api.add_resource(Signup,'/signup')

class User_By_Id(Resource):
    @jwt_required()
    def get(self):
        id=get_jwt_identity()
        if id:
            user=User.query.filter_by(id=id).first()
            if user:
                return make_response(user.to_dict(),200)
            else:
                return make_response({"error":["User not found"]},404)
api.add_resource(User_By_Id,'/user')

class User_By_Email(Resource):
    def patch(self,email):
        user=User.query.filter_by(email=email).first()
        if user:
            data=request.get_json()
            for attr in data:
                if attr=="password":
                    setattr(user,attr,bcrypt.generate_password_hash(data[attr]).decode('utf-8'))
            db.session.commit()
            return make_response(user.to_dict(),200)
        return make_response({"error":["No user matches your email"]},404)
api.add_resource(User_By_Email,'/user/<string:email>')
class Add_Get_County(Resource):
    def get(self):
        counties=County.query.all()
        return make_response([county.to_dict() for county in counties],200)

    def post(self):
        data=request.get_json()
        name=data['name']
        if '  ' not in name and len(name)>3:
            county=County.query.filter_by(name=name).first()
            if county:
                return make_response({"error":[f"{name} county already exists"]},404)
            new_county=County(name=name)
            if new_county:
                db.session.add(new_county)
                db.session.commit()
                return make_response(new_county.to_dict(),201)
            else:
                return make_response({"error":"Error creating county"},500)
        else:
            return make_response({"error":"Invalid name"},500)
api.add_resource(Add_Get_County,'/county')

class County_by_id(Resource):
    def get(self,id):
        county=County.query.filter_by(id=id).first()
        if county:
            return make_response(county.to_dict(),200)
        else:
            return make_response({"error":f"county id {id} does not exist"})
    def delete(self,id):
        county=County.query.filter_by(id=id).first()
        if county:
            db.session.delete(county)
            db.session.commit()
            return make_response({"message":"County deleted successfully"},204)
        else:
            return make_response({"error":f"county id {id} does not exist"},404)
api.add_resource(County_by_id,'/county/<int:id>')

class Add_Get_Constituency(Resource):
    def get(self):
        constituencies=Constituency.query.all()
        return make_response([constituency.to_dict() for constituency in constituencies],200)
    def post(self):
        data=request.get_json()
        name=data['name']
        county1=data['county']
        county=County.query.filter_by(name=county1).first()
        if county:
            if '  ' not in name and len(name)>3:
                constituency=Constituency.query.filter_by(name=name).first()
                if constituency:
                    return make_response({"error":[f"{name} constituency already exists"]},404)
                new_constituency=Constituency(name=name,county_id=county.id)
                if new_constituency:
                    db.session.add(new_constituency)
                    db.session.commit()
                    return make_response(new_constituency.to_dict(),201)
                else:
                    return make_response({"error":["Internal server error"]},500)
            else:
                return make_response({"error":["Invalid data"]},404)
        else:
            return make_response({"error":[f"{county1} county not found"]},404)
api.add_resource(Add_Get_Constituency,'/constituency')

class Constituency_By_Id(Resource):
    def get(self,id):
        constituency=Constituency.query.filter_by(id=id).first()
        if constituency:
            return make_response(constituency.to_dict(),200)
        return make_response({"error":f"Constituency {id} does not exist"},404)
    def patch(self,id):
        data=request.get_json()
        constituency=Constituency.query.filter_by(id=id).first()
        
        if constituency:
            # constituency=constituency.to_dict()
            for key in data:
                setattr(constituency,key,data.get(key))
            db.session.add(constituency)
            db.session.commit()
            return make_response(constituency.to_dict(),200)
        return make_response({"error":f"Constituency {id} does not exist"},404)
    def delete(self,id):
        constituency=Constituency.query.filter_by(id=id).first()
        if constituency:
            db.session.delete(constituency)
            db.session.commit()
            return make_response({"messsage":["Delete successful"]},204)
        return make_response({"error":f"Constituency {id} does not exist"},404)
api.add_resource(Constituency_By_Id,'/constituency/<int:id>')

class Add_Get_Ward(Resource):
    def post(self):
        data=request.get_json()
        name=data["name"]
        county_id=data["county"]
        constituency_id=data["constituency"]
        county=County.query.filter_by(name=county_id).first()
        constituency=Constituency.query.filter_by(name=constituency_id).first()
        if "  " not in name and len(name)>3:
            ward=Ward.query.filter_by(name=name).first()
            if ward:
                return make_response({"error":[f"{name} ward already exists"]},400)
            new_ward=Ward(name=name, county_id=county.id,constituency_id=constituency.id)
            db.session.add(new_ward)
            db.session.commit()
            return make_response(new_ward.to_dict(),204)
        else:
            return make_response({"error":["Invalid name entry"]},400)
    def get(self):
        ward=Ward.query.all()
        return make_response([wards.to_dict() for wards in ward],200)
api.add_resource(Add_Get_Ward,'/ward')

class Ward_By_Id(Resource):
    def get(self,id):
        ward=Ward.query.filter_by(id=id).first()
        if ward:
            return make_response(ward.to_dict(),200)
        return make_response({"error":[f"Ward {id} does not exist"]})
    def delete(self,id):
        ward=Ward.query.filter_by(id=id).first()
        if ward:
            db.session.delete(ward)
            db.session.commit()
            return make_response({"message":["deleted successfully"]},204)
        return make_response({"error":[f"Ward {id} does not exist"]})
    def patch(self,id):
        ward=Ward.query.filter_by(id=id).first()
        if ward:
            data=request.get_json()
            name=data["name"]
            if "  " not in name and len(name)>3:
                for attr in data:
                    setattr(ward,attr,data[attr])
                db.session.add(ward)
                db.session.commit()
                return make_response(ward.to_dict(),201)
            return make_response({"errors":["Invalid name value"]},404)
        return make_response({"error":[f"Ward {id} does not exist"]},404)
api.add_resource(Ward_By_Id,'/ward/<int:id>')

class Login(Resource):
    def post(self):
        data=request.get_json()
        email=data["email"]
        password=data["password"]
        user=User.query.filter_by(email=email).first()
        if user:
            if bcrypt.check_password_hash(user.password, password):
                access_token=create_access_token(identity=user.id)
                refresh_token=create_refresh_token(identity=user.id)

                return make_response({"access_token":access_token,"refresh_token":refresh_token,"user":user.id,"role":user.role},200)
            return make_response({"error":["Wrong password"]},400)
        return make_response({"error":[f"{email} not registered. Proceed to signup?"]},404)
api.add_resource(Login,'/login')

class Voter_Details(Resource):
    # @jwt_required()
    def post(self,id):
        data=request.get_json()
        national_id=data["nationalId"]
        registration_date=datetime.datetime.now()
        voter=Voter.query.filter_by(national_id=national_id).first()
        voter1=Voter.query.filter_by(user_id=id).first()
        county=County.query.filter_by(name=data["county"]).first()
        constituency=Constituency.query.filter_by(name=data["constituency"]).first()
        ward=Ward.query.filter_by(name=data["ward"]).first()
        if voter or voter1:
            return make_response({"error":[f"{national_id} is already registered as a voter"]},404)
        if len(str(national_id))==8 :
            new_voter=Voter(
                national_id=national_id,registration_date=registration_date,
                user_id=id,
                county_id=county.id,
                constituency_id=constituency.id,
                ward_id=ward.id
                )
            db.session.add(new_voter)
            db.session.commit()
            return make_response(new_voter.to_dict(),201)
        return make_response({"error":["Invalid data entry"]})
    # @jwt_required()
    def patch(self,id):
        data=request.get_json()
        voter=Voter.query.filter_by(id=id).first()
        if voter:
            national_id=data["nationalId"]
            if len(str(national_id))==8:
                for attr in data:
                    if attr=="constituency":
                        constituency=Constituency.query.filter_by(name=data["constituency"]).first()
                        if constituency:
                            setattr(voter,'constituency_id',constituency.id)
                    if attr=="county":
                        county=County.query.filter_by(name=data["county"]).first()
                        if county:
                            setattr(voter,'county_id',county.id)
                    if attr=="ward":
                        ward=Ward.query.filter_by(name=data["ward"]).first()
                        if ward:
                            setattr(voter,'ward_id',ward.id)
                    if attr=='national_id':
                        setattr(voter,attr,data[attr])
            # db.session.add(voter)
            db.session.commit()
            return make_response(voter.to_dict(),200)
    # @jwt_required()
    def get(self,id):
        voter=Voter.query.filter_by(id=id).first()
        if voter:
            return make_response(voter.to_dict(),200)
        else:
            return make_response({"error":["Voter doesn't exist"]})
    def delete(self,id):
        voter=Voter.query.filter_by(id=id).first()
        if voter:
            db.session.delete(voter)
            db.session.commit()
            return make_response({"message":["Voter deleted successfully"]},204)
        return make_response({"error":["Voter not found"]},404)
api.add_resource(Voter_Details,'/add-voter-details/<int:id>')

class Get_Voters(Resource):
    @jwt_required()
    def get(self):
        id=get_jwt_identity()
        if id:
            voters=Voter.query.all()
            return make_response([voter.to_dict() for voter in voters],200)
api.add_resource(Get_Voters, '/voters')

class Add_Get_Candidate(Resource):
    def post(self):
        data = request.get_json()
        positions = ['President', "Governor", "Senator", "MP", "MCA"]
        position = data["position"]
        voter_id = data["name"]
        election1 = data["election"]
        region = data["region"]
        image_url=data["image_url"]
        party=data["party"]
        description=data["description"]
        # Get the new fields
        
        election = Election.query.filter_by(name=election1).first()
        voter = Voter.query.filter_by(national_id=voter_id).first()
        candidate1=Candidate.query.filter_by(voter_id=voter.id).first()
        if candidate1 and candidate1.election_id==election.id:
            return make_response({"error":["This candidate is already participating in this election"]},400)
        if voter:
            if position in positions:
                # Create the candidate with the new fields
                candidate = Candidate(
                    position=position,
                    voter_id=voter.id,
                    election_id=election.id,
                    region=region,
                    party=party,
                    description=description,
                    image_url=image_url
                )
                if candidate:
                    db.session.add(candidate)
                    db.session.commit()
                    return make_response(candidate.to_dict(), 201)
                else:
                    return make_response({"error": ["An error occurred. Kindly try again later"]}, 500)
            else:
                return make_response({"error": [f"Select a position from {positions}"]})
        else:
            return make_response({"error": ["Not a registered voter"]}, 404)

    def get(self):
        candidates=Candidate.query.all()
        all_candidates=[]
        for candidate in candidates:
            candidate=candidate.to_dict()
        #     print(candidate["image_url"])
            candidate['image_url']=f"{request.host_url}/static/{candidate["image_url"]}"
            all_candidates.append(candidate)
            
        return make_response(all_candidates,200)
api.add_resource(Add_Get_Candidate,'/candidates')

class Candidate_By_Id(Resource):
    def get(self,id):
        candidate=Candidate.query.filter_by(id=id).first()
        if candidate:
            return make_response(candidate.to_dict(),200)
        else:
            return make_response({"error":[f"Candidate {id} not found"]},404)
    def patch(self,id):
        candidate=Candidate.query.filter_by(id=id).first()
        if candidate:
            data=request.get_json()
            position=data["position"]
            if position in ['President',"Governor","Senator","Member of Parliament","MCA"]:
                for attr in data:
                    setattr(candidate,attr,data[attr])
                db.session.add(candidate)
                db.session.commit()
                return make_response(candidate.to_dict(),200)
            else:
                return make_response({"error":[f"Select a position from ['President','Governor','Senator','Member of Parliament','MCA']"]},400)
        else:
            return make_response({"error":[f"Candidate {id} not found"]},404)
    def delete(self,id):
        candidate=Candidate.query.filter_by(id=id).first()
        if candidate:
            db.session.delete(candidate)
            db.session.commit()
            return make_response({"message":["Candidate deleted successfully"]},204)
        else:
            return make_response({"error":[f"Candidate {id} not found"]},404)
api.add_resource(Candidate_By_Id,'/candidate/<int:id>')

class Get_Boundaries(Resource):
    def get(self):
        counties=County.query.all()
        constituencies=Constituency.query.all()
        all={
            "counties":[county.to_dict(['name','constituencies']) for county in counties],
            "constituencies":[constituency.to_dict(['name','wards']) for constituency in constituencies]
        }
        return make_response(all,200)
api.add_resource(Get_Boundaries,'/get-boundaries')

class Add_get_Election(Resource):
    def post(self):
        data=request.get_json()
        name=data["name"]
        type=data["type"]
        region=data["region"]
        # status=data["status"]
        election_date=data["election_date"]
        date=datetime.datetime.now()
        election1=Election.query.filter_by(name=name).first()
        if election1:
            return make_response({"error":["This election already exists"]},404)
        else:
            election=Election(name=name,type=type,status="Pending",date=date, election_date=election_date, region=region)
            if election:
                db.session.add(election)
                db.session.commit()
                return make_response(election.to_dict(),201)
            else:
                return make_response({"error":["Server error"]},500)
    def get(self):
        elections=Election.query.all()
        return make_response([election.to_dict() for election in elections],200)
api.add_resource(Add_get_Election,'/elections')

class Election_By_Id(Resource):
    def get(self,id):
        election=Election.query.filter_by(id=id).first()
        if election:
            return make_response(election.to_dict(),200)
        else:
            return make_response({"error":["Election doesnt exist"]},404)
    def delete(self,id):
        election=Election.query.filter_by(id=id).first()
        if election:
            db.session.delete(election)
            db.session.commit()
            return make_response({"message":["Election deleted successfully"]},204)
        return make_response({"error":["Election does not exist"]},404)
    def patch(self,id):
        election=Election.query.filter_by(id=id).first()
        if election:
            data=request.get_json()
            for attr in data:
                setattr(election,attr,data[attr])
            db.session.add(election)
            db.session.commit()
            return make_response(election.to_dict(),200)
        else:
            return make_response({"error":["Election not found"]},404)
api.add_resource(Election_By_Id,'/election/<int:id>')


class VoteResource(Resource):
    def post(self):
        data = request.get_json()

        # Extract the necessary fields
        candidate_name = data.get('candidate')
        election_name = data.get('election')
        voter_national_id = data.get('voter')

        # Check if all required fields are provided
        if not candidate_name or not election_name or not voter_national_id:
            return make_response({'message': ['Missing required fields']}, 400)

        # Ensure the election exists
        election = Election.query.filter_by(name=election_name).first()
        if not election:
            return make_response({'message': ['Election not found']}, 404)
        # Ensure the candidate exists
        candidate = Candidate.query.filter_by(id=candidate_name, election_id=election.id).first()
        if not candidate:
            return make_response({'message': ['Candidate not found in this election']}, 404)
        # Ensure the voter exists
        voter = Voter.query.filter_by(national_id=voter_national_id).first()
        if not voter:
            return make_response({'message': ['Voter not found']}, 404)

        

        # Check if the voter has already voted in this election
        existing_vote = Vote.query.filter_by(voter_id=voter.id, election_id=election.id).all()
        if len(existing_vote)>5:
            return make_response({'message': ['Voter has already voted in this election']}, 400)
        # try:
            # Create a new vote record
        vote = Vote(
            candidate_id=candidate.id,
            election_id=election.id,
            voter_id=voter.id
        )
        if vote:
        # Add the new vote to the session and commit
            db.session.add(vote)
            db.session.commit()

            return  make_response(vote.to_dict(), 201)
        return make_response({'message': ['An error occurred while processing the vote']}, 500)
        # except:
        #     db.session.rollback()
        #     return make_response({'message': ['An error occurred while processing the vote']}, 500)
    
    def get(self):
        votes=Vote.query.all()
        return make_response([vote.to_dict() for vote in votes],200)

api.add_resource(VoteResource,'/vote')
if __name__ == '__main__':
    app.run(port=5555, debug=True)

