#!/bin/bash

for filename in /media/ml/Data/ml/robomow/ingest/*.mp4; do
    echo $filename
    ffmpeg -i "$filename" -vf fps=3,scale=800:-1 "/media/ml/Data/ml/robomow/img/$(basename "$filename" .mp4)_%03d.png"
    mv $filename /media/ml/Data/ml/robomow/ingest/archive/
done
