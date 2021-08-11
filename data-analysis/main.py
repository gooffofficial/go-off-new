from fastapi import FastAPI
import uvicorn

app= FastAPI()
print('connected to fastAPI')

@app.get("/")
async def home():
    return {"message":"Welcome to home"}

@app.get("/execanalytics/{id}")
async def executeAnalytics(id:str):
    return {"message":f"Analytics executed for {id}"}

if __name__=="__main__":
    uvicorn.run(app,port=8080, host="localhost",)
    