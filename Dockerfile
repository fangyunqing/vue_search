FROM nginx
WORKDIR /front
RUN mkdir /front/search
COPY dist/ /front/search/

