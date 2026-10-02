import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


DATA_PATH = "Dataset/student_performance_50k.csv"

df = pd.read_csv(DATA_PATH)

excluded_features = [
    "final_gpa",
    "improvement_next_term",
    "dropout_risk_score",
    "learning_efficiency",
    "stress_index",
    "pass_fail",
    "honors_flag",
    "at_risk_flag",
    "top_performer_flag"
]

X = df.drop(columns=excluded_features)
y = df["final_gpa"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

categorical_cols = [
    "gender",
    "urban_flag",
    "parent_education",
    "internet_access",
    "private_tuition",
    "study_room",
    "scholarship_flag",
    "ai_tool_usage",
    "device_availability"
]

numerical_cols = [
    col for col in X.columns
    if col not in categorical_cols
]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ]
)

X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

model = LinearRegression()

model.fit(X_train_processed, y_train)

y_pred = model.predict(X_test_processed)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("MODEL EVALUATION")
print("----------------")
print("MAE:", mae)
print("MSE:", mse)
print("R²:", r2)

feature_names = preprocessor.get_feature_names_out()

feature_importance = pd.DataFrame({
    "feature": feature_names,
    "coefficient": model.coef_,
    "absolute_coefficient": abs(model.coef_)
})

feature_importance = feature_importance.sort_values(
    "absolute_coefficient",
    ascending=False
)

print("\nTOP 15 FEATURES")
print("----------------")
print(feature_importance.head(15))

joblib.dump(model, "ml/model.pkl")
joblib.dump(preprocessor, "ml/preprocessor.pkl")