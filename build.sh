sudo $(aws ecr get-login --no-include-email --region us-east-1)

cd Ads/
sudo docker build -t ads_microservice .
sudo docker tag ads_microservice:latest 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:ads
sudo docker push 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:ads

cd ../Exclusion/
sudo docker build -t exclusion_microservice .
sudo docker tag exclusion_microservice:latest 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:exclusion
sudo docker push 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:exclusion

cd ../Matching/
sudo docker build -t matching_microservice .
sudo docker tag matching_microservice:latest 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:matching
sudo docker push 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:matching

cd ../Pricing/
sudo docker build -t pricing_microservice .
sudo docker tag pricing_microservice:latest 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:pricing
sudo docker push 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:pricing

cd ../Query/
sudo docker build -t query_microservice .
sudo docker tag query_microservice:latest 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:query
sudo docker push 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:query

cd ../Ranking/
sudo docker build -t ranking_microservice .
sudo docker tag ranking_microservice:latest 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:ranking
sudo docker push 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:ranking

cd ../Targeting/
sudo docker build -t targeting_microservice .
sudo docker tag targeting_microservice:latest 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:targeting
sudo docker push 449449804646.dkr.ecr.us-east-1.amazonaws.com/microservices:targeting
