#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Testing backup/restore functionality..."

# Test 1: Full System Backup
echo -n "Testing full system backup... "
BACKUP=$(curl -s http://localhost:3000/api/backup/all)
if [ $? -eq 0 ] && [ ! -z "$BACKUP" ] && [[ "$BACKUP" == *"users"* ]]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Test 2: Full System Restore
echo -n "Testing full system restore... "
RESTORE_RESULT=$(curl -s -X POST http://localhost:3000/api/restore/all \
    -H "Content-Type: application/json" \
    -d "$BACKUP")
if [ $? -eq 0 ] && [[ "$RESTORE_RESULT" == *"success"* ]]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "Error: $RESTORE_RESULT"
    exit 1
fi

# Test 3: Piggybank Backup
echo -n "Testing piggybank backup... "
PIGGY_BACKUP=$(curl -s http://localhost:3000/api/backup/piggybank)
if [ $? -eq 0 ] && [ ! -z "$PIGGY_BACKUP" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Test 4: Piggybank Restore
echo -n "Testing piggybank restore... "
PIGGY_DATA=$(echo "$PIGGY_BACKUP" | jq -c '.data.piggybank')
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

echo -e "\n${GREEN}All backup/restore tests passed!${NC}" 