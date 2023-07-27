from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.vectorstores import Pinecone
import pinecone
import requests
from dotenv import load_dotenv
import os
load_dotenv()

KEY = os.getenv("PINECONE_API_KEY")
ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")

pinecone.init(
    api_key=KEY,
    environment=ENVIRONMENT
)

question = input("Enter the question")
instructor_embedding = HuggingFaceInstructEmbeddings(
    model_name="hkunlp/instructor-base")
db = Pinecone(index=pinecone.Index('pdf-search'),
              embedding_function=instructor_embedding.embed_query, text_key="text")
answer = db.similarity_search(question)

context = "\n\n".join([doc.page_content for doc in answer])
system = """You are a helpful bot.That reads the given context and provides the answer form there. 
You are not suppose to create your own answer. You will only give the answer from the given context.
 If you do not find the answer in the context simply say "I don't know """
data = {
    "system": system,
    "prompt": question,
    "context": context
}
res = requests.post("http://localhost:3000/answer", json=data)
print(res.json())
print(answer)
