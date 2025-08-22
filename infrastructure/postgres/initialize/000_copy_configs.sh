#!/bin/sh
set -e

echo Copying Configs over...

# create temporary directory for postgres in docker
mkdir /tmp/stat_temporary

# make sure the directory is owned by postgres
chown postgres:postgres /tmp/stat_temporary

# copy your postgresql.conf to postgresql config location in docker
cp /db_config/postgresql.conf /var/lib/postgresql/data/postgresql.conf


echo Initializing Extensions...