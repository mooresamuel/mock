from flask import Flask, request, jsonify
from flask_cors import CORS
from MySQLcalls import MySQLCalls
from transcribe import transcribe_audio
import json
import  os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@app.route('/')
def hello_world():
    return 'Hello, World!'

db_config = {
    'database': os.getenv('DB_NAME', 'default_db_name'),
    'user': os.getenv('DB_USER', 'default_user'),
    'password': os.getenv('DB_PASSWORD', 'default_password'),
    'host': os.getenv('DB_HOST', 'default_host')
}

db = MySQLCalls(db_config)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    return transcribe_audio()

@app.route('/save_question', methods=['POST'])
def add_question():
    data = request.get_json()
    return db.save_question(data)

@app.route('/add_user_question', methods=['POST'])
def add_user_question():
    data = request.get_json()
    return db.save_user_question(data)

@app.route('/get_questions', methods=['GET'])
def load_questions():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id parameter'}), 400
    questions_df = db.get_questions(int(user_id))
    questions_json = questions_df.to_json(orient='records')
    return jsonify(json.loads(questions_json))

@app.route('/get_user_questions', methods=['GET'])
def load_user_questions():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id parameter'}), 400
    user_questions_df = db.get_user_questions(int(user_id))
    user_questions_json = user_questions_df.to_json(orient='records')
    return jsonify(json.loads(user_questions_json))

@app.route('/save_user', methods=['POST'])
def add_user():
    data = request.get_json()
    return db.save_user(data)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return db.login(data)