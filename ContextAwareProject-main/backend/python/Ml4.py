import pandas as pd
import numpy as np
import joblib
#import matplotlib.pyplot as plt
import json
import sys

# Raccolta dei dati
train_data = pd.read_csv('python/dati2.csv', delimiter=',')

train_data['Data'] = pd.to_datetime(train_data['Data'], format='%Y-%m-%d')
train_data['Anno'] = train_data['Data'].dt.year  # Aggiungi l'anno come feature
train_data.set_index('Data', inplace=True)

# Lista delle zone OMI di interesse
zone_list = train_data['Luogo'].unique()

# Carica il modello dal disco
rf_loaded = joblib.load('python/random_forest_model.pkl')

# Lista per salvare le previsioni per tutte le zone OMI
all_forecast_data = []

for zone in zone_list:
    # Seleziona i dati per la zona OMI corrente
    df = train_data[train_data['Luogo'] == zone][['Valore', 'Anno']]
    
    # Preparazione dei dati
    forecast_out = int(np.ceil(0.05 * len(df)))
    df['label'] = df['Valore'].shift(-forecast_out)

    # Carica i dati in X per le previsioni
    X_Predictions = df.drop(['label'], axis=1).iloc[-forecast_out:]

    # Previsioni con il modello caricato
    forecast_set = rf_loaded.predict(X_Predictions)

    # Date per le previsioni future, incrementate di un anno
    forecast_dates = pd.date_range(start=df.index[-1] + pd.DateOffset(years=1), periods=len(X_Predictions), freq='YS')

    # Salvataggio delle previsioni per la zona OMI corrente
    forecast_data = pd.DataFrame({'Date': forecast_dates, 'Luogo': [zone]*len(forecast_dates), 'Forecast': forecast_set})
    forecast_data['Year'] = forecast_data['Date'].dt.year
    all_forecast_data.append(forecast_data)

# Concatenazione di tutte le previsioni per tutte le zone OMI
forecast_df = pd.concat(all_forecast_data)

# Stampa delle previsioni
forecast_data = []
for i, row in forecast_df.iterrows():
    data_dict = {
        "Data": str(row['Date'].date()),  # Converte la data in formato stringa
        "Luogo": row['Luogo'],
        "Prezzo previsto": row['Forecast']
    }
    forecast_data.append(data_dict)

# Converti la lista di dizionari in formato JSON
forecast_json = json.dumps(forecast_data, indent=4)

# Assicurati che 'Date' sia nel formato datetime per le previsioni
forecast_df['Date'] = pd.to_datetime(forecast_df['Date'])

# # Grafico a linee per il prezzo storico nel tempo per ogni zona OMI
# plt.figure(figsize=(12, 8))

# # Ciclo per plottare i dati di addestramento per ogni zona OMI
# for zone in zone_list:
#     data_zone = train_data[train_data['Luogo'] == zone]
#     plt.plot(data_zone.index, data_zone['Valore'], linestyle='-', marker='o', label=f'{zone} - Dati storici')

# # Ciclo per plottare le previsioni per ogni zona OMI
# for zone in zone_list:
#     data_zone = forecast_df[forecast_df['Luogo'] == zone]
#     plt.plot(data_zone['Date'], data_zone['Forecast'], linestyle='--', marker='x', label=f'{zone} - Previsioni')

# plt.xlabel('Data')
# plt.ylabel('Prezzo')
# plt.title('Confronto tra dati storici e previsioni prezzi futuri')
# plt.xticks(rotation=45)
# plt.tight_layout()
# plt.grid(True)
# plt.show()

print(json.dumps(forecast_json))

sys.stdout.flush()