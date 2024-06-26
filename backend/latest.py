

import os
import openai
from dotenv import load_dotenv
from collections import defaultdict
load_dotenv()

OPENAI_API_KEY= os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY #get from .env

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
    #STATE
    #ACCOUNTNUMBER
    #the levels of masking
    sentence=""
    masked_sentence=""

    options={
        "default":["CITY","COMPANYNAME","CURRENCY","DATE","EMAIL","FIRSTNAME","LASTNAME","MIDDLENAME","SSN","STATE","ACCOUNTNUMBER"],
        "custom":[]
    }

    #this dictionary will store the replacement words for each category
    replace={
        "FIRSTNAME":["david","bill","emily","john","robert"],
        "COMPANYNAME":["Google","Apple","Microsoft","Walmart"],
        "DATE":["January 1st","January 2nd", "January 3rd", "January 4th","January 5th"],
        "CITY":["Toronto","Ottawa", "Montreal", "Vancouver", "Calgary"],
        "SSN":["99-999-999"],
        "EMAIL":["hello@gmail.com","who@yahoo.com"],
        "LASTNAME":["Brown","Willson"],
        "CURRENCY":["Euro","Canadian Dollar","Pound"],
        "MIDDLENAME":["James","Micheal","Grace","Ann"],
        "STATE":["New York","Florida","Texas"],
        "ACCOUNTNUMBER":["0112345678","0114342678"]
    }

    #this dictionary will store the original enitity and what it was masked to. good for mapping back
    store={
        "original":[],
        "masked":[],
        "type":[]
    }

    #this dictionary will store how many times each entity has been used. useless now
    usecount={
        "FIRSTNAME":0,
        "COMPANYNAME":0,
        "DATE":0,
        "CITY":0,
        "EMAIL":0,
        "CURRENCY":0,
        "SSN":0,
        "MIDDLENAME":0,
        "LASTNAME":0,
        "STATE":0,
        "ACCOUNTNUMBER":0
    }

    #This dictionary is the mask that the user manually assigns: It should also be saved in database for reuse
    manualdict={
        "Entity":[],
        "Type":[]
    }

    def __init__(self,mode,mask_level):
        #initalize these to nothing
        self.mode=mode
        if(mode==1):
            self.masklevel=self.options["default"]
        else:
            custom_options=mask_level
            self.options["custom"]=custom_options
            self.masklevel=self.options["custom"]
    
    def mask_sentence(self,input_sentence,inference_res):
        self.sentence=input_sentence
        sentence=self.sentence
        
        #reset everything
        self.store["original"]=[]
        self.store["masked"]=[]
        self.store["type"]
        self.manualdict["Entity"]=[]
        self.manualdict["Type"]=[]
        for key in self.usecount:
            self.usecount[key]=0
        
        for ent in inference_res:
            
            for label in self.masklevel:
                
                if(ent["entity_group"]==label):
                    if(ent["word"] not in self.store["original"]):
                        count=sentence.count(ent["word"])
                        #replacing happens here
                        for options_for_replacement in self.replace[label]:
                            if(options_for_replacement not in self.store["masked"] and options_for_replacement.upper()!=ent["word"].upper()):
                                for y in range(count):
                                    sentence=sentence.replace(ent["word"],options_for_replacement)
                                self.store["original"].append(ent["word"])
                                self.store["masked"].append(options_for_replacement)
                                self.store["type"].append(label)
                                break

                    else:
                        count=sentence.count(ent["word"])
                        for y in range(count):
                            sentence=sentence.replace(ent["word"],self.store["masked"][self.store["original"].index(ent["word"])])
        
        #change the masked sentence
        
        self.masked_sentence=sentence
        return sentence,self.store

    def get_sentence(self):
        return self.sentence

    def get_masklevel(self):
        return self.masklevel

    def change_masklevel(self,mode,mask_level):
        
        self.mode=mode
        if(mode==1):
            self.masklevel=self.options["default"]
        else:
            custom_options=mask_level
            self.options["custom"]=custom_options
            self.masklevel=self.options["custom"]

    def manual_mask(self,words,entity):
        
        print("\n")
        print("please identify the type of the entity you want to mask: ")
       
        manual_mask_entity_map = defaultdict(dict)
        for x in range(len(words)):
            input1=words[x]
            input2=entity[x]
            if(input1 in self.masked_sentence and input2 in self.options["default"]):
                
                self.manualdict["Entity"].append(input1)
                self.manualdict["Type"].append(input2)
                count=self.masked_sentence.count(input1)

                for options_for_replacement in self.replace[input2]:
                    if(options_for_replacement not in self.store["masked"] and options_for_replacement.upper()!=input1.upper()):
                        for y in range(count):
                            self.masked_sentence=self.masked_sentence.replace(input1,options_for_replacement)
                        self.store["original"].append(input1)
                        self.store["masked"].append(options_for_replacement)
                        self.store["type"].append(input2)
                        manual_mask_entity_map[input2][input1] = options_for_replacement
                        break

            else:
                print("please enter a valid entity and type \n")

        return self.sentence, self.masked_sentence, self.store, manual_mask_entity_map
        
    def manual_unmask(self,words,entity):
        print("\n")
        print("please identify the type of the entity you want to unmask: ")
        for x in range(len(words)):
            input1=words[x]
            input2=entity[x]
            print(input1)
            print(input2)
            print(self.masked_sentence)
            if(input1 in self.masked_sentence and input2 in self.options["default"]):
                
                occurances=self.masked_sentence.count(input1)
                index_of_entity=self.store["masked"].index(input1)
                
                for x in range(occurances):
                    self.masked_sentence=self.masked_sentence.replace(input1,self.store["original"][index_of_entity]) #check this again
                del self.store["type"][self.store["masked"].index(input1)]
                self.store["masked"].remove(input1)
                self.store["original"].remove(self.store["original"][index_of_entity])
                
            else:
                print("please enter a valid entity and type \n")

        return self.sentence, self.masked_sentence, self.store 

    def get_maskedsentence(self):
        return self.masked_sentence
    
    def get_response(self):
        response=openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        prompt=self.masked_sentence, #here is where sentence goes
        max_tokens=1000,
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
                      "prompt": self.masked_sentence,
                      "Response_Message":response_message,
                      "Orignal_Message":og
                    }
        print(final_output)
        return final_output


#some basic post and get request
from fastapi import FastAPI

app = FastAPI()


#p1.mask_sentence("hello my name is bill")

