import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from scipy.stats import pearsonr

# data = {
#     'pain': [5, 4, 7, 6, 3],  # pain
#     'psychological_0': [7, 6, 8, 5, 7],  # mood
#     'psychological_1': [3, 4, 5, 3, 2],  # stress
#     'psychological_2': [2, 5, 3, 4, 2],  # anxiety
#     'sleep_0': [7, 5, 6, 8, 7],  # sleep_quality
#     'sleep_1': [7, 6, 8, 5, 7],  # sleep_duration
#     'sleep_2': [1, 0, 2, 1, 0],  # wake_ups
#     'diet_0': [5, 4, 6, 5, 4],  # plant_variety
#     'diet_1': [2, 3, 2, 3, 1],  # food_packaging
#     'diet_2': [1, 2, 1, 1, 2],  # meat_dairy_meals
#     'exercise_0': [3, 2, 4, 3, 3],  # exercise_intensity
#     'exercise_1': [20, 15, 25, 20, 30],  # exercise_duration
#     'exercise_2': [2, 3, 2, 3, 3],  # exercise_exertion
#     'social_0': [4, 3, 5, 3, 4],  # work_relationships
#     'social_1': [5, 3, 4, 4, 5],  # family_relationships
#     'social_2': [5, 6, 7, 5, 6],  # friend_relationships
# }
data = {
    'pain': [3, 0, 2, 1, 1, 0, 3, 3, 0, 0, 3, 4, 0, 0, 0, 5, 3, 2, 0, 0, 0, 4, 2, 2, 1, 0, 2, 2, 1, 0],
    'psychological_0': [6, 7, 4, 6, 6, 7, 4, 4, 6, 5, 6, 6, 6, 6, 7, 4, 7, 7, 7, 6, 5, 4, 5, 7, 7, 5, 5, 5, 7, 7],
    'psychological_1': [6, 2, 5, 3, 6, 5, 2, 2, 4, 4, 3, 5, 5, 4, 5, 5, 2, 4, 6, 4, 6, 2, 3, 5, 2, 5, 3, 3, 2, 3],
    'psychological_2': [2, 3, 5, 5, 4, 5, 4, 5, 2, 5, 4, 4, 3, 2, 5, 3, 5, 5, 3, 3, 3, 3, 3, 5, 3, 2, 4, 3, 3, 5],
    'sleep_0': [6, 6, 6, 8, 6, 7, 8, 7, 8, 6, 7, 8, 5, 6, 8, 5, 8, 5, 6, 7, 5, 8, 6, 5, 8, 8, 8, 5, 5, 5],
    'sleep_1': [8, 6, 6, 6, 8, 6, 6, 8, 8, 8, 6, 8, 8, 6, 8, 6, 7, 8, 7, 6, 8, 6, 7, 6, 8, 8, 7, 6, 8, 7],
    'sleep_2': [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    'diet_0': [5, 4, 6, 6, 4, 6, 6, 4, 4, 6, 6, 6, 5, 5, 5, 4, 5, 4, 4, 5, 5, 5, 6, 5, 6, 4, 6, 5, 4, 4],
    'diet_1': [1, 3, 2, 1, 1, 1, 3, 3, 2, 3, 1, 2, 1, 1, 3, 2, 3, 3, 2, 1, 1, 2, 1, 2, 2, 3, 2, 3, 1, 1],
    'diet_2': [1, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1],
    'exercise_0': [4, 3, 2, 3, 3, 3, 4, 4, 2, 2, 4, 3, 2, 4, 4, 4, 3, 4, 4, 4, 4, 2, 2, 4, 3, 2, 4, 2, 2, 3],
    'exercise_1': [21, 29, 28, 24, 17, 21, 26, 30, 24, 30, 23, 18, 26, 15, 16, 15, 30, 28, 26, 19, 19, 30, 25, 21, 23, 23, 17, 17, 30, 30],
    'exercise_2': [2, 3, 3, 3, 3, 2, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2],
    'social_0': [3, 3, 3, 3, 4, 3, 5, 5, 3, 3, 5, 5, 4, 5, 4, 4, 4, 4, 4, 3, 5, 4, 5, 5, 4, 3, 4, 3, 5, 3],
    'social_1': [3, 3, 5, 5, 3, 3, 4, 3, 4, 3, 4, 5, 3, 3, 3, 3, 4, 3, 5, 5, 3, 5, 3, 3, 5, 3, 5, 4, 3, 4],
    'social_2': [7, 6, 6, 7, 6, 6, 7, 6, 7, 6, 7, 7, 6, 6, 6, 5, 5, 5, 7, 6, 7, 5, 6, 7, 6, 7, 6, 5, 5, 6],
}

# How many data points?
additionalDataPoints = 1000
additionalData = {key: np.random.normal(np.mean(value), np.std(value), additionalDataPoints).round().astype(int) for key, value in data.items()}

dataFrame = pd.DataFrame(data)
additionalDataFrame = pd.DataFrame(additionalData)
finalDataFrame = pd.concat([dataFrame, additionalDataFrame], ignore_index=True)

independentVariables = finalDataFrame.drop('pain', axis=1)
dependentVariable = finalDataFrame['pain']

# Splitting the data into training and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(independentVariables, dependentVariable, test_size=0.2, random_state=0)

model = LinearRegression()
model.fit(X_train, y_train)

score = model.score(X_test, y_test)

# Predictions can also be made
predictions = model.predict(X_test)

print("Model Accuracy:", score)

# Overall correlations
correlation_results = {}
for column in independentVariables.columns:
    corr, p_value = pearsonr(independentVariables[column], dependentVariable)
    correlation_results[column] = {'correlation': corr, 'p_value': p_value}

# Convert the results to a DataFrame for better visualization
correlation_df = pd.DataFrame(correlation_results).T
correlation_df.sort_values(by='p_value', inplace=True)

print(correlation_df)