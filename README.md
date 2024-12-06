- Steps to setup tailwindcss environment
    
    1- open new terminal and type the following (setting up packages.json):
    
    ```jsx
    npm init -y
    ```
    
    2- Install tailwindcss by typing the following command in the terminal:
    
    ```jsx
    npm install tailwind css
    ```
    
    3- create src folder and create styles.css file inside it
    
    4- create public folder
    
    5- copy the following lines of codes inside styles.css file to get all the functionality of taiwind:
    
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
    
    6- go to packages.json file and under scripts, do the following:
    
    - delete test the script
    - replace it with:
    
    ```jsx
    "build-css": "tailwindcss build src/styles.css -o public/styles.css"
    ```
    
    7- run this command in the terminal:
    
    ```jsx
    	npm run build-css
    ```
    
    if nothing changes when writing tailwind code, do the following:
    
    Fonts and colors were not showing until I did the following...
    (I'm running tailwindcss v3.0.23)
    
    1) Run the following command in the terminal:
    npx tailwindcss init
    
    This creates a file tailwind.config.js in the root directory i.e. same directory as package.json
    
    2) Update the file content as follows:
    
    module.exports = {
      content: [
        './public/**/*.{html,js}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    
    3) Run the following command in the terminal:
    npm run build-css
    
    4) Run the following command in the terminal:
    npx tailwindcss -i ./src/styles.css -o ./public/styles.css --watch
    
    That did it for me!
    
    Further reference: https://tailwindcss.com/docs/installation
    
    **Show less**






run in the terminal 

npm run build-css

and then

npm start (to start a server)
