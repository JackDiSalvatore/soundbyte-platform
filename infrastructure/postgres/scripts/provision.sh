#!/bin/bash

NEW_DB_USER=$1
NEW_DB_NAME=$2
DB_PASSWORD=$3

function runProvsioneer() {
    echo Provisioning Database ${NEW_DB_NAME} For User ${NEW_DB_USER}

    if [ -z ${NEW_DB_USER} ]; then
        echo you must supply a user as the first parameter
        exit 1
    fi

    if [ -z ${NEW_DB_NAME} ]; then
        echo you must supply a the database name as the second parameter
        exit 1
    fi

    if [ -z ${DB_PASSWORD} ]; then
        DB_PASSWORD="password"
    fi

    echo "Creating Database ${NEW_DB_NAME}"
    psql -q ON_ERROR_STOP=0 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
    CREATE USER ${NEW_DB_USER} WITH PASSWORD '${DB_PASSWORD}';
    CREATE DATABASE ${NEW_DB_NAME};
    GRANT ALL PRIVILEGES ON DATABASE ${NEW_DB_NAME} TO ${NEW_DB_USER};
    ALTER USER ${NEW_DB_USER} WITH SUPERUSER; 
EOSQL

    echo "Setting up Version Table on ${NEW_DB_NAME}"
    psql -q ON_ERROR_STOP=0 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS VERSION (
        ID SERIAL PRIMARY KEY,
        VERSION VARCHAR(128) NOT NULL,
        RELEASE_DATE TIMESTAMP NOT NULL
    );
    INSERT INTO VERSION (VERSION, RELEASE_DATE) VALUES('1.0.0', CURRENT_TIMESTAMP);
EOSQL

    echo "Setting up UUID Extensions for ${NEW_DB_NAME}"
    psql -q ON_ERROR_STOP=0 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL

}

runProvsioneer