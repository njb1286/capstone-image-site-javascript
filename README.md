To turn on the app, follow these steps:

1. Open a terminal.
2. Navigate to the root directory of the frontend project.
3. Run the following command to start the frontend:
  ```bash
  npm run dev
  ```

  Or to build the frontend, you can run:

  ```bash
  npm run build
  ```

  This will build the app in the backend directory, and then all you have to do is run the backend, and the whole app runs.

4. Open another terminal.
5. Navigate to the root directory of the backend project.
6. Run the following command to start the backend:
  ```bash
  npm start
  ```

  Or to start the Python backend, navigate to the backend/src directory, and run:
  ```bash
  python3 index.py
  ```

  Please note that if you use the Python server, you will have to set the environment variable "SITE_PASSWORD" in order to set the password to login

  Linux:
  ```bash
  export SITE_PASSWORD=*Your password of choice*
  python3 index.py
  ```

  Windows:
  ```cmd
  set SITE_PASSWORD=*Your password of choice*
  python3 index.py
  ```

  If you want to run the Python server as production, make sure you have waitress installed, then you can run the command:
  ```bash
  waitress-serve index:app
  ```

Once both the frontend and backend are running, you should be able to access the app in your browser.