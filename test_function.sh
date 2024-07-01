#!/bin/bash

curl -v -X POST https://acoustic-zoo-little.functions.on-fleek.app \
-H "Content-Type: application/json" \
-d '{
  "body": "{\"hash\": \"0xf97de14ca3aab49e921904b4368eefeb9698e018\"}"
}' 2>&1 | tee /dev/tty | grep -o '{.*}'