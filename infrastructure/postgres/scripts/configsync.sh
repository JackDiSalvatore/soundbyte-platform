#!/bin/bash

cp /db_config/postgresql.conf /var/lib/postgresql/data/postgresql.conf

psql -U postgres -d postgres -c "SHOW max_connections;"