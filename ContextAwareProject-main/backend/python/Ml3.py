import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import numpy as np
import json
import sys
import os
import pickle

# Raccolta dei dati
train_data = pd.read_csv('backend/python/dati2.csv', delimiter=',')

train_data['Data'] = pd.to_datetime(train_data['Data'], format='%Y-%m-%d')
train_data['Anno'] = train_data['Data'].dt.year  # Aggiungi l'anno come feature
train_data.set_index('Data', inplace=True)

# Preparazione dei dati
X = train_data[['Valore', 'Anno']]  # Usa il valore e l'anno come feature
y = train_data['Valore'].shift(-1)  # Previsione dell'anno successivo

# Rimuovi le righe con valori NaN
X = X[:-1]
y = y[:-1]

# Divisione dei dati in set di addestramento e test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modellazione con Random Forest
rf = RandomForestRegressor()
rf.fit(X_train, y_train)

# Previsioni sui dati di training
y_train_pred = rf.predict(X_train)

# Previsioni sui dati di test
y_test_pred = rf.predict(X_test)

# Calcolo dei valori di MAE e RMSE per il training set
mae_train = mean_absolute_error(y_train, y_train_pred)
rmse_train = np.sqrt(mean_squared_error(y_train, y_train_pred))

# Calcolo dei valori di MAE e RMSE per il test set
mae_test = mean_absolute_error(y_test, y_test_pred)
rmse_test = np.sqrt(mean_squared_error(y_test, y_test_pred))

print(f'Training MAE: {mae_train}')
print(f'Training RMSE: {rmse_train}')
print(f'Test MAE: {mae_test}')
print(f'Test RMSE: {rmse_test}')

# save_dir = 'backend/python'
# a=joblib.dump(rf, os.path.join(save_dir, 'random_forest_model.pkl'))

with open('random_forest_model.pkl', 'wb') as f:
    pickle.dump(rf, f)

print(json.dumps("ciao"))

sys.stdout.flush()
