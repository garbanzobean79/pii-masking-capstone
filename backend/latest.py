

import os
import openai

openai.api_key = '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'

import spacy
  
nlp = spacy.load('en_core_web_sm')

#the levels of masking
class mask:
    
    #the levels of masking
    options={
        "level1":["PERSON"],
        "level2":["ORG","PERSON"],
        "level3":["ORG","PERSON","DATE","GPE"],
        "level4":["ORG","PERSON","DATE","EVENT"],
        "level5":["ORG","PERSON","DATE","EVENT","FAC"],
        "custom":[]
    }

    #this dictionary will store the replacement words for each category
    replace={
        "PERSON":["david","bill","emily","john","robert"],
        "ORG":["CompanyA","CompanyB","CompanyC"],
        "Date":["january 1st","january 2nd", "january 3rd", "january 4th"],
        "GPE":["Toronto","Ottawa", "Montreal", "Vancouver"],
        "EVENT":["Event A","Event B", "Event C", "Event D"],
        "FAC":["hello1","hello2"]
    }

    #this dictionary will store the original enitity and what it was masked to. good for mapping back
    store={
        "original":[],
        "masked":[]
    }

    #this dictionary will store how many times each entity has been used
    usecount={
        "PERSON":0,
        "ORG":0,
        "Date":0,
        "GPE":0,
        "EVENT":0,
        "FAC":0
    }


    #This dictionary is the mask that the user manually assigns: It should also be saved in database for reuse
    manualdict={
        "Entity":[],
        "Type":[]
    }

    def __init__(self):
        #initalize these to nothing
        self.sentence=""
        self.level=1
        self.masklevel=self.options["level1"]
        
        self.masked_sentence=""
    
    def change_sentence(self,input_sentence):
        self.sentence=input_sentence

        sentence=self.sentence

        doc = nlp(sentence)

        #print(nlp.get_pipe('ner').labels)
        #this will mask the sentence and give masked sentence as sentence1
        for ent in doc.ents:
            print(ent.text, ent.start_char, ent.end_char, ent.label_)
            for label in self.masklevel:
                
                if(ent.label_==label):
                    if(ent.text not in self.store["original"]):
                        count=sentence.count(ent.text)
                        for y in range(count):
                            sentence=sentence.replace(ent.text,self.replace[label][self.usecount[label]])

                        self.store["original"].append(ent.text)
                        self.store["masked"].append(self.replace[label][self.usecount[label]])
                        self.usecount[label]+=1
                        
                    else:
                        count=sentence.count(ent.text)
                        for y in range(count):
                            sentence=sentence.replace(ent.text,self.store["masked"][self.store["original"].index(ent.text)])
        
        #change the masked sentence
        self.masked_sentence=sentence


    def get_sentence(self):
        return self.sentence

    def get_masklevel(self):
        return self.level

    def change_masklevel(self,level):
        self.level=level

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
                      "Reponse_Message":response_message,
                      "Orignal_Message":og
                    }

        return final_output





#some basic post and get request
from fastapi import FastAPI

app = FastAPI()

p1=mask()

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

