FROM ubuntu
# Create app directory
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive 
ENV TZ=America/New_York
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json yarn.lock ./

RUN apt-get update || : && apt remove cmdtest && apt remove yarn && \
apt install -y curl gnupg && \
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
apt-get install -y python3 \
nodejs \
yarn \
npm \
python3-pip && \
npm install -g yarn@1.22.5 && \
rm -rf /var/lib/apt/lists/*

# If you are building your code for production
# RUN npm ci --only=production

COPY . .
RUN yarn install && \ 
pip3 install -r requirements.txt && \
python3 -m nltk.downloader popular -d /usr/nltk_data && \
python3 -m nltk.downloader punkt -d /usr/nltk_data && \
python3 -m nltk.downloader stopwords -d /usr/nltk_data && \
python3 -m nltk.downloader twitter_samples -d /usr/nltk_data && \
python3 -m nltk.downloader wordnet -d /usr/nltk_data && \
python3 -m nltk.downloader vader_lexicon -d /usr/nltk_data && \
python3 -m nltk.downloader averaged_perceptron_tagger -d /usr/nltk_data
EXPOSE 8000
EXPOSE 4050

CMD [ "node", "server.js" ]