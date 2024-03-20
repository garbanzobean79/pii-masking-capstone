This flask backend's dependencies are managed using a virtual environment.

To set up the virtual environment:
1. Clone this repository.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment: `. .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`

Once the virtual environment is activated, run the backend in debug mode using the command:
```
uvicorn main:app --reload
```

To deactivate the virtual environment, run the following command:
```
deactivate
```

To install new packages to the virtual environment, first activate the virtual environment and run the follow command:
```
pip install <package_name>
```

To generate a random secret key to be used to sign JWT tokens, use the command:
```
openssl rand -hex 32
```
To generate a random secret key to be used to sign JWT tokens, use the command:
```
openssl rand -hex 32
```

To gain access to the firstore database:
- Get the key.json file from discord / google cloud console
- Place the key.json file in the backend folder

