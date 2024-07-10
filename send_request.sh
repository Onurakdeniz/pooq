#!/bin/bash

URL="https://full-napkin-square.functions.on-fleek.app"

curl -v -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123456",
    "castType": "post",
    "hash": "abcdef123456",
    "text": "# [Title = The Future of AI]\n* [Description = An exploration of artificial intelligence and its potential impact on society]\n[View = Technological]\n\nArtificial Intelligence (AI) is rapidly evolving, with potential applications in various fields such as healthcare, finance, and transportation. As AI systems become more sophisticated, they raise important questions about ethics, privacy, and the future of work. Companies like Google, OpenAI, and DeepMind are at the forefront of AI research, pushing the boundaries of what'"'"'s possible. The coming decades will likely see significant advancements in machine learning, natural language processing, and robotics, fundamentally changing how we live and work."
  }' \
  "$URL"

echo