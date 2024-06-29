FROM nikolaik/python-nodejs:python3.9-nodejs20-slim
WORKDIR '/app'
COPY package.json .
COPY . .
#RUN npm install
RUN pip install scikit-learn
RUN pip install pandas
# RUN pip install geopandas
# RUN pip install pysal
# RUN pip install folium
EXPOSE 4000
CMD ["node", "index.js"]