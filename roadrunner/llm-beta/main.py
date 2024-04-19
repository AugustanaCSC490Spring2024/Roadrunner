from app import create_app

app = create_app()

if __name__ =="__main__":
    print("Came here first")
    app.run(debug=True, port=5000, host='0.0.0.0')