

import os
import openai

API_KEY= os.getenv("LLM_KEY")
openai.api_key =  API_KEY #get from .env

import spacy
  
nlp = spacy.load('en_core_web_sm')

#the levels of masking
class mask:
    #things to mask:
    #City
    #CompanyName
    #Currency
    #Date
    #Email
    #FirstName
    #Lastname
    #Middlename
    #SSN
    #the levels of masking
    options={
        "default":["CITY","COMPANYNAME","CURRENCY","DATE","EMAIL","FIRSTNAME","LASTNAME","MIDDLENAME","SSN"],
        "custom":[]
    }

    #this dictionary will store the replacement words for each category
    replace={
        "FIRSTNAME":["david","bill","emily","john","robert"],
        "COMPANYNAME":["CompanyA","CompanyB","CompanyC"],
        "DATE":["DATE A","Date B","DATE C","january 1st","january 2nd", "january 3rd", "january 4th"],
        "CITY":["City A","City B","Toronto","Ottawa", "Montreal", "Vancouver", "CALGARY"],
        "SSN":["99-999-999"],
        "EMAIL":["hello@gmail.com","who@yahoo.com"],
        "LASTNAME":["Brown","Willson"],
        "CURRENCY":["CURRENCY A","CURRENCY B","CURRENCY C"],
        "MIDDLENAME":["James,Micheal,Grace,Ann"]
    }

    #this dictionary will store the original enitity and what it was masked to. good for mapping back
    store={
        "original":[],
        "masked":[]
    }

    #this dictionary will store how many times each entity has been used
    usecount={
        "FIRSTNAME":0,
        "COMPANYNAME":0,
        "DATE":0,
        "CITY":0,
        "EMAIL":0,
        "CURRENCY":0,
        "SSN":0,
        "MIDDLENAME":0,
        "LASTNAME":0
    }


    #This dictionary is the mask that the user manually assigns: It should also be saved in database for reuse
    manualdict={
        "Entity":[],
        "Type":[]
    }

    def __init__(self,mode,**kwargs):
        #initalize these to nothing
        self.mode=mode
        if(mode==1):
            self.masklevel=self.options["default"]
        else:
            custom_options=kwargs.get('custom',None)
            self.options["custom"]=[custom_options]
            self.masklevel=self.options["custom"]
    
    def mask_sentence(self,input_sentence,inference_res):
        self.sentence=input_sentence

        sentence=self.sentence
        
        for ent in inference_res:
            
            for label in self.masklevel:
                
                if(ent["entity_group"]==label):
                    if(ent["word"] not in self.store["original"]):
                        count=sentence.count(ent["word"])
                        for y in range(count):
                            sentence=sentence.replace(ent["word"],self.replace[label][self.usecount[label]])

                        self.store["original"].append(ent["word"])
                        self.store["masked"].append(self.replace[label][self.usecount[label]])
                        self.usecount[label]+=1
                        
                    else:
                        count=sentence.count(ent["word"])
                        for y in range(count):
                            sentence=sentence.replace(ent["word"],self.store["masked"][self.store["original"].index(ent["word"])])
        
        #change the masked sentence
        self.masked_sentence=sentence
        return sentence

    def get_sentence(self):
        return self.sentence

    def get_masklevel(self):
        return self.level

    def change_masklevel(self,mode,**kwargs):

        self.mode=mode
        if(mode==1):
            self.masklevel=self.options["default"]
        else:
            custom_options=kwargs.get('custom',None)
            self.options["custom"]=[custom_options]
            self.masklevel=self.options["custom"]

    def get_maskedsentence(self):
        return self.masked_sentence
    
    def get_response(self):
        response=openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        prompt=self.masked_sentence, #here is where sentence goes
        max_tokens=100,
        temperature=0
        )
        response_message = response["choices"][0]["text"]

        og=response_message
    
        sentence1=og.split()

        for strings in sentence1:
            
            for masked in self.store["masked"]:
                stringlower=strings.lower()
                maskedlower=masked.lower()

                if(stringlower==maskedlower):
                    og=og.replace(strings,self.store["original"][self.store["masked"].index(masked)])

                if(stringlower.replace("'s","")==maskedlower):
                    og=og.replace(strings,self.store["original"][self.store["masked"].index(masked)]+"'s")

        final_output={
                      "Response_Message":response_message,
                      "Orignal_Message":og
                    }

        return final_output



#some basic post and get request
from fastapi import FastAPI

app = FastAPI()

p1=mask(1)

@app.get("/functions/get_response")
async def root():
    return {"message": p1.get_response()}

@app.get("/functions/get_maskedsetence")
async def root():
    
    return {"message": p1.get_maskedsentence()}

@app.get("/functions/get_sentence")
async def root():
    
    return {"message": p1.get_sentence()}

@app.get("/functions/get_masklevel")
async def root():
    
    return {"message": p1.get_masklevel()}

@app.post("/functions/change_sentence")
async def root(sentence: str):
    p1.change_sentence(sentence)
    return {"message": p1.get_maskedsentence()}

