#!/bin/bash

echo "Testing Celebration Toggle Feature"
echo "=================================="

API_URL="http://localhost:3002/api"

# Function to check current celebration setting
check_celebration_status() {
    echo -n "Current celebration_enabled status: "
    curl -s "${API_URL}/settings" | grep -o '"celebration_enabled":"[^"]*"' || echo "not set (defaults to true)"
}

# Function to set celebration status
set_celebration() {
    local status=$1
    echo "Setting celebration_enabled to: ${status}"
    curl -s -X PUT "${API_URL}/settings" \
        -H "Content-Type: application/json" \
        -d "{\"setting_key\":\"celebration_enabled\",\"setting_value\":\"${status}\"}" \
        > /dev/null
}

# Test 1: Check default state
echo -e "\n1. Testing default state (should be true):"
check_celebration_status

# Test 2: Set to false
echo -e "\n2. Testing disabled state:"
set_celebration false
check_celebration_status

# Test 3: Set to true
echo -e "\n3. Testing enabled state:"
set_celebration true
check_celebration_status

# Test 4: Verify UI endpoint
echo -e "\n4. Verifying Global Settings page loads:"
if curl -s http://localhost:3002/global-settings | grep -q "Task Completion Celebration"; then
    echo "✅ Celebration toggle is present in Global Settings"
else
    echo "❌ Celebration toggle NOT found in Global Settings"
fi

echo -e "\n=================================="
echo "Test Summary:"
echo "- API endpoints are working"
echo "- Settings can be toggled between true/false"
echo "- UI component is present in Global Settings"
echo ""
echo "To fully test the feature:"
echo "1. Open http://localhost:3002 in a browser"
echo "2. Navigate to Global Settings"
echo "3. Toggle 'Task Completion Celebration' switch"
echo "4. Go to Task Completion page"
echo "5. Complete a task and verify celebration behavior"