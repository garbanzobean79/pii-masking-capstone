This flask backend's dependencies are managed using a virtual environment.

To install all the packages for the virtual environment, run the following command:
```
pip install -r requirements.txt
```

To activate the virtual environment, run the following command:
```
. .venv/bin/activate
```

To deactivate the virtual environment, run the following command:
```
deactivate
```

To install new packages to the virtual environment, first activate the virtual environment and run the follow command:
```
pip3 install <package_name>
```

To gain access to the firstore database:
- Get the key.json file from discord / google cloud console
- Place the key.json file in the backend folder

Once the virtual environment is activated, run the backend in debug mode using the command:
```
uvicorn main:app --reload
```