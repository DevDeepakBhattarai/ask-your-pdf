from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import Pinecone
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pinecone
from dotenv import load_dotenv
import os
load_dotenv()

KEY = os.getenv("PINECONE_API_KEY")
ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
BASE_URL = "g:\Coding\chatgpt-with-pupeteer\py"

print(KEY, ENVIRONMENT)
pinecone.init(
    api_key=KEY,
    environment=ENVIRONMENT
)
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=500,
#                                                chunk_overlap=20)

instructor_embedding = HuggingFaceInstructEmbeddings(
    model_name="hkunlp/instructor-base")

# loader = PyPDFLoader(BASE_URL + "/inputs/attention.pdf")
# pages = loader.load_and_split(text_splitter=text_splitter)

# for page in pages:
#     Pinecone.from_documents(pages, instructor_embedding,
#                             index_name="pdf-search")

db = Pinecone(index=pinecone.Index('pdf-search'),
              embedding_function=instructor_embedding.embed_query, text_key="text")
answer = db.similarity_search("What is transformer?")
print(answer)
