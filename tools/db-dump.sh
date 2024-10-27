#!/bin/bash

# Set the database password
export PGPASSWORD='*R2?c6M$uvEg'\''eD'

# Run pg_dump to export the schema
pg_dump -U tgeld_admin -h localhost -p 5432 -s tgeld > schema_dump.txt

# Unset the database password for security
unset PGPASSWORD

echo "Database schema has been exported to schema_dump.txt"