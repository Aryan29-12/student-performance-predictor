import os
import joblib

def predict_gpa(data):
    processed_data = preprocessor.transform(data)
    prediction = model.predict(processed_data)

    return prediction[0]

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "ml", "preprocessor.pkl")

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)