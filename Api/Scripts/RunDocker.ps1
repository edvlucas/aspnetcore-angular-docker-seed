docker build -t api .
docker run -it -v %cd%:/app -p 2001:2001 api
