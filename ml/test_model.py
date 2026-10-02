import joblib
import pandas as pd

model = joblib.load("ml/model.pkl")
preprocessor = joblib.load("ml/preprocessor.pkl")
df = pd.read_csv("Dataset/student_performance_50k.csv")
sample = df.drop(columns=[
    "final_gpa",
    "improvement_next_term",
    "dropout_risk_score",
    "learning_efficiency",
    "stress_index",
    "pass_fail",
    "honors_flag",
    "at_risk_flag",
    "top_performer_flag"
]).iloc[[0]]
processed_sample = preprocessor.transform(sample)
prediction = model.predict(processed_sample)
actual_gpa = df["final_gpa"].iloc[0]

print("Actual GPA:", actual_gpa)
print("Predicted GPA:", prediction[0])