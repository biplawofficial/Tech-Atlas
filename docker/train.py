import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# Toy training data: 1 = positive, 0 = negative
texts = [
    "I loved this movie, it was fantastic and thrilling",
    "Absolutely wonderful, a masterpiece",
    "Great acting and a beautiful story",
    "What a brilliant and moving film",
    "Best movie I have seen all year",
    "Terrible film, I hated every minute",
    "Boring and a complete waste of time",
    "Awful acting and a dull plot",
    "I would not recommend this to anyone",
    "The worst movie ever made",
]
labels = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", LogisticRegression()),
])
model.fit(texts, labels)
joblib.dump(model, "model.pkl")
print("Model trained and saved to model.pkl")
