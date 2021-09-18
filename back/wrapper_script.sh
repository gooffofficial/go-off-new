#!/bin/bash
  
# turn on bash's job control
set -m
  
# Start the primary process and put it in the background
# RUN cd /app/client && npm run build && \
# npm install 
# 
cd client
nohup yarn start > client-out.log 2>&1 &

# client/package.json &
  
# Start the helper process
cd ..
nohup yarn start > backrun-out.log 2>&1 &
  
# the my_helper_process might need to know how to wait on the
# primary process to start before it does its work and returns
  
  
# now we bring the primary process back into the foreground
# and leave it there
#fg %1

tail -f client/client-out.log backrun-out.log

