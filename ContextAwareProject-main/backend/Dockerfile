FROM nikolaik/python-nodejs:python3.9-nodejs20-slim
WORKDIR '/app'
COPY package.json .
COPY . .
RUN npm install
RUN pip install scikit-learn==1.5.0
RUN pip install pandas
RUN npm install request
EXPOSE 4000
CMD ["node", "index.js"]