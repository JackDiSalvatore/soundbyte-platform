#!/bin/bash

# Database connection parameters
DB_USER="postgres"
DB_PATTERN="tolam"
PG_TABLE_PATTERN="pg_"
SQ_TABLE_PATTERN="sql_"

# Get a list of database names that match the pattern
DATABASES=$(psql -U $DB_USER -l -t | awk '{print $1}' | grep "$DB_PATTERN")

# Loop through the matching databases
for database in $DATABASES; do
    echo "Processing database: $database"

    # Get a list of table names in the database that match the table pattern
    TABLES=$(psql -U $DB_USER -d $database -t -c "SELECT tablename FROM pg_tables WHERE tablename NOT LIKE 'pg_%' AND tablename NOT LIKE 'sql_%' AND tablename NOT LIKE 'flyway_%';")
    echo "Found Tables: $TABLES"
    # Loop through the table names and truncate them
    for table in $TABLES; do
        echo "Truncating table: $table"
        psql -U $DB_USER -d $database -c "TRUNCATE TABLE $table CASCADE;"
    done

    echo "All matching tables in $database truncated."
done

echo "All matching tables in the specified databases truncated."