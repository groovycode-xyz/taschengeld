#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting backup/restore tests..."

# Test 1: Tasks Backup
echo -n "Testing tasks backup... "
TASKS_BACKUP=$(curl -s -X GET http://localhost:3000/api/backup/tasks)
if [ $? -eq 0 ] && [ ! -z "$TASKS_BACKUP" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Test 2: Tasks Restore
echo -n "Testing tasks restore... "
RESTORE_RESULT=$(curl -s -X POST http://localhost:3000/api/restore/tasks \
    -H "Content-Type: application/json" \
    -d "$TASKS_BACKUP")
if [ $? -eq 0 ] && [[ "$RESTORE_RESULT" == *"success"* ]]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "Error: $RESTORE_RESULT"
    exit 1
fi

# Test 3: Piggybank Backup
echo -n "Testing piggybank backup... "
PIGGY_BACKUP=$(curl -s -X GET http://localhost:3000/api/backup/piggybank)
if [ $? -eq 0 ] && [ ! -z "$PIGGY_BACKUP" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Test 4: Piggybank Restore
echo -n "Testing piggybank restore... "
# Extract the piggybank data from the nested structure
PIGGY_DATA=$(echo "$PIGGY_BACKUP" | jq -c '.data.piggybank')
echo "Sending data: $PIGGY_DATA"
RESTORE_RESULT=$(curl -s -X POST http://localhost:3000/api/restore/piggybank \
    -H "Content-Type: application/json" \
    -d "$PIGGY_DATA")
if [ $? -eq 0 ] && [[ "$RESTORE_RESULT" == *"success"* ]]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "Error: $RESTORE_RESULT"
    exit 1
fi

# Test 5: Full System Backup
echo -n "Testing full system backup... "
FULL_BACKUP=$(curl -s -X GET http://localhost:3000/api/backup/all)
if [ $? -eq 0 ] && [ ! -z "$FULL_BACKUP" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Test 6: Full System Restore
echo -n "Testing full system restore... "
# Extract and format the data for restore
echo "Full backup data: $FULL_BACKUP"
RESTORE_RESULT=$(curl -s -X POST http://localhost:3000/api/restore/all \
    -H "Content-Type: application/json" \
    -d "$FULL_BACKUP")
if [ $? -eq 0 ] && [[ "$RESTORE_RESULT" == *"success"* ]]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "Error: $RESTORE_RESULT"
    exit 1
fi

echo -e "\n${GREEN}All tests passed!${NC}" 