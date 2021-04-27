#!/bin/sh
exec >sizes.txt
for f in *.svg; do
	printf "%s\t" "$f"
	gzip -cn "$f" | wc -c
done
