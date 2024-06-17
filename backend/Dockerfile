FROM nikolaik/python-nodejs:python3.9-nodejs20-slim
WORKDIR '/app'
COPY package.json .
COPY . .
#RUN npm install
RUN pip install scikit-learn
RUN pip install pandas
EXPOSE 4000
CMD ["node", "index.js"]