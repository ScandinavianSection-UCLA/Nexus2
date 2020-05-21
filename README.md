# Danish Folklore Nexus React App
This is a getting started guide to run the EKT database viewer designed by Dr. Timothy Tangherlini (UCLA) 
and Pete Broadwell (UCLA). React Application was created by Daniel Huang (UCLA). <br>

# Getting Started
1. [Install node.js](https://nodejs.org/en/download/) which comes with npm, a JS package manager. 
2. On terminal, run `npm` to check if node has been successfully installed
3. Once installed, navigate to repository directory (i.e. `C:/Users/[username]/Desktop/Nexus2`) and run `npm install`
4. After all packages have been installed, run application with `npm start`
5. Once server is successfully running, open on browser at `localhost:3000`

# Troubleshooting
* If you are having fail to compile errors, it is likely that npm and node cannot compile ES6. Be sure they are set to npm 6.1.0v and node 8.9.4v

# Running in Docker
1. Navigate to repository directory root
1. Build Docker image with `nexus2` as the name of your image:
`docker build -t nexus2 .`
2. Bind app's 3000 port to localhost:8080 and run the app: `docker run -p 8080:3000 nexus2`
3. Once server is successfully running, open on browser at `localhost:8080`
