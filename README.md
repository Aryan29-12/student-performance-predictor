# Student Performance ML API

A Django REST API that manages student academic data and uses a machine learning model to predict a student's final GPA based on academic, behavioral, and demographic features.

## Features

* Student data management using Django and Django REST Framework
* PostgreSQL database integration
* CRUD operations for student records
* Filtering, searching, and pagination
* Authentication and API permissions
* Input and cross-field validation
* Machine learning-based GPA prediction
* Saved ML model and preprocessing pipeline
* REST API endpoint for generating predictions

## Tech Stack

* **Python**
* **Django**
* **Django REST Framework**
* **PostgreSQL**
* **Pandas**
* **Scikit-learn**
* **Joblib**

## Project Structure

```text
student-performance-ml-api/
│
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── students/
│   ├── migrations
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── filters.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── ml/
│   ├── inspect_data.py
│   ├── train_model.py
│   ├── test_model.py
│   ├── predict.py
│   ├── model.pkl
│   └── preprocessor.pkl
│
├── .gitignore
├── manage.py
└── requirements.txt
```

## Machine Learning

The project uses a regression-based machine learning approach to predict student GPA.

The ML pipeline includes:

1. Loading and inspecting the dataset
2. Selecting input features and target variable
3. Splitting data into training and testing sets
4. Preprocessing numerical and categorical features
5. Training the regression model
6. Saving the trained model using Joblib
7. Saving the preprocessing pipeline
8. Loading the saved model for prediction through the API

The trained model and preprocessing pipeline are stored in:

```text
ml/model.pkl
ml/preprocessor.pkl
```

## API

The project provides REST API endpoints for managing student information and generating predictions.

The API supports operations such as:

* Creating student records
* Retrieving student records
* Updating student records
* Deleting student records
* Filtering and searching student data
* Paginating results
* Generating predicted GPA values

The prediction endpoint returns a response similar to:

```json
{
    "predicted_gpa": 2.5152300829949903
}
```

## Database

The application uses **PostgreSQL** as its database.

The database stores student information including academic, demographic, behavioral, and other relevant attributes used by the application.

Database credentials and other environment-specific configuration are stored in a `.env` file and are not included in this repository.

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Aryan29-12/student-performance-predictor
cd student-performance-predictor
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root.

Add the required environment variables used by the Django settings, including the Django secret key and PostgreSQL database configuration.

Example:

```text
SECRET_KEY=your-secret-key
```

Do not commit the `.env` file to GitHub.

### 5. Configure PostgreSQL

Create a PostgreSQL database and configure its connection details in the `.env` file according to the settings used by the project.

### 6. Apply migrations

```bash
python manage.py migrate
```

### 7. Create a superuser

```bash
python manage.py createsuperuser
```

### 8. Run the development server

```bash
python manage.py runserver
```

The API can then be accessed through:

```text
http://127.0.0.1:8000/
```

## Dataset

The datasets used during development and model training are **not included in this repository**.

The original dataset was reduced to a smaller working dataset during development to make model training and experimentation practical on a system without a dedicated GPU.

The repository contains the trained model and preprocessing pipeline rather than the raw dataset.

## Security

Sensitive configuration is kept outside the repository.

The following files are intentionally excluded using `.gitignore`:

```text
.env
db.sqlite3
__pycache__/
```


## Current Status

The project currently includes:

* Django project setup
* PostgreSQL database integration
* Student data models
* Django REST Framework APIs
* CRUD operations
* Validation
* Filtering and searching
* Pagination
* Authentication and permissions
* Machine learning model
* Saved preprocessing pipeline
* GPA prediction API

