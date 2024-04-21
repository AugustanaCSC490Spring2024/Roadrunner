from app import create_app
import os

app = create_app()

# Get the port from the environment variable, defaulting to 3000 if not set
port = int(os.environ.get('PORT', 5000))

if __name__ =="__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')