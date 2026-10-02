import pandas as pd

# Load original 1M-row dataset
df = pd.read_csv("Dataset/student_academic_performance_1M.csv")

print("Original dataset shape:")
print(df.shape)

# Randomly select 50,000 rows
df_sample = df.sample(n=50000, random_state=42)

# Save the sampled dataset
df_sample.to_csv("Dataset/student_performance_50k.csv", index=False)

# print("\nSampled dataset shape:")
# print(df_sample.shape)

# print("\nFINAL GPA ANALYSIS")
# print("------------------")

# print("\nFinal GPA statistics:")
# print(df_sample["final_gpa"].describe())

# print("\nMissing values in final_gpa:")
# print(df_sample["final_gpa"].isnull().sum())

# print("\nFinal GPA range:")
# print(df_sample["final_gpa"].min(), "to", df_sample["final_gpa"].max())

# print("\nCORRELATION WITH FINAL GPA")
# print("--------------------------")

# correlation = df_sample.corr(numeric_only=True)["final_gpa"].sort_values(
#     ascending=False
# )

# print(correlation)

print("\nACADEMIC SCORE ANALYSIS")
print("-----------------------")

score_columns = [
    "math_score",
    "science_score",
    "english_score",
    "history_score",
    "computer_score"
]

# df_sample["average_subject_score"] = df_sample[score_columns].mean(axis=1)

# print("\nCorrelation between average subject score and final GPA:")
# print(df_sample["average_subject_score"].corr(df_sample["final_gpa"]))

# print("\nCorrelation between standardized exam score and final GPA:")
# print(df_sample["standardized_exam_score"].corr(df_sample["final_gpa"]))

# print("\nCorrelation between previous GPA and final GPA:")
# print(df_sample["previous_gpa"].corr(df_sample["final_gpa"]))

# print("\nNUMERICAL FEATURE SUMMARY")
# print("-------------------------")

# numeric_columns = df_sample.select_dtypes(include="number").columns

# print(df_sample[numeric_columns].describe().T)

# print("\nCATEGORICAL FEATURE VALUES")
# print("-------------------------")

# categorical_columns = [
#     "gender",
#     "urban_flag",
#     "parent_education",
#     "internet_access",
#     "private_tuition",
#     "study_room",
#     "scholarship_flag",
#     "ai_tool_usage",
#     "device_availability"
# ]

# for column in categorical_columns:
#     print(f"\n{column}:")
#     print(df_sample[column].value_counts().sort_index())

print("\nMISSING VALUES")
print("--------------")

print(df_sample.isnull().sum().sort_values(ascending=False).head(15))

print("\nDUPLICATE ROWS")
print("--------------")

print("Duplicate rows:", df_sample.duplicated().sum())