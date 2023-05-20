FROM nginx:1.24.0
WORKDIR /front
RUN mkdir /front/search
COPY dist/ /front/search/

