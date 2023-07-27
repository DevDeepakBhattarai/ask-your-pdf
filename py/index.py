from flask import Flask, render_template, request, jsonify
import requests
from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.vectorstores import Pinecone
import pinecone
from dotenv import load_dotenv
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
load_dotenv()

app = Flask(__name__)

KEY = os.getenv("PINECONE_API_KEY")
ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
BASE_URL = "G:\Coding\chatgpt-pdf-reader\py\inputs\\"

pinecone.init(
    api_key=KEY,
    environment=ENVIRONMENT)


instructor_embedding = HuggingFaceInstructEmbeddings(
    model_name="hkunlp/instructor-base")

db = Pinecone(index=pinecone.Index('pdf-search'),
              embedding_function=instructor_embedding.embed_query, text_key="text")


@app.route('/')
def pdf():
    return render_template('pdf.html')


@app.route('/question', methods=["GET", "POST"])
def question():
    if request.method == "POST":
        data = request.get_json()
        question = data.get("question")

        return process_question(question)
    return render_template("question.html")


def process_question(question):

    # Perform similarity search and get the context
    answer = db.similarity_search(question)
    context = "\n\n".join([doc.page_content for doc in answer])

    # Prepare the data for the front-end
    system = """You are a helpful bot. That reads the given context and provides the answer from there.
               You are not supposed to create your own answer. You will only give the answer from the given context.
               If you do not find the answer in the context, simply say "I don't know" """
    data = {
        "system": system,
        "prompt": question,
        "context": context
    }
    # Post the data to the external server (you might need to adjust the URL accordingly)
    res = requests.post("http://localhost:3000/answer", json=data)
    return res.json()


@app.route('/upload', methods=['POST'])
def upload():
    if 'pdfFile' not in request.files:
        return {"error": "No file part"}

    file = request.files['pdfFile']
    print(file)

    if file.filename == '':
        return {"error": "No selected file"}

    file_path = os.path.join(BASE_URL, file.filename)
    file.save(file_path)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500,
                                                   chunk_overlap=20)

    loader = PyPDFLoader(file_path)
    pages = loader.load_and_split(text_splitter=text_splitter)

    print(f"There are {len(pages)} docs")

    Pinecone.from_documents(pages, instructor_embedding,
                            index_name="pdf-search")

    # Your existing code for processing the PDF file here...
    # (Make sure to update the file_path accordingly)

    return {"message": "PDF uploaded successfully!"}


if __name__ == '__main__':
    app.run(debug=True)
