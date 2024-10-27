# Test Case 1 - Status Bar Default Setting on App Load

Test Date/Time: 2024-10-27 17:40 CEST

**Step 1**
npm run dev
Expected Result: Dev server starts without error
Observed Result: Dev server starts without error
Status: Pass

**Step 2**
Open browser to localhost:3001/
Expected Result: See the "Welcome to Taschengeld" page
Observed Result: See the "Welcome to Taschengeld" page
Status: Pass

**Step 3**
Check the sidebar Parent Mode toggle. It should be set to "Default"
Expected Result: It should be "Switch to Parent Mode (Disabled)" is selected" and all 5 sidebar items are shown
Observed Result: Switch to Parent Mode (Disabled) is seen and all 5 sidebar items are shown
Status: Pass

**Step 4**
Go to Global Settings page by clicking on the "Settings" button in the top right corner
Expected Result: See the Global Settings page, Enforce Parent/Child Roles is set to "Disabled"
Observed Result: See the Global Settings page, Enforce Parent/Child Roles is set to "Disabled"
Status: Pass

**Step 5**
Toggle Enforce Parent/Child Roles to "Enabled"
Expected Result: See the Global Settings page, Enforce Parent/Child Roles is set to "Enabled", and the page is not reloaded but instead the PIN input field is shown.
Observed Result: See the Global Settings page, Enforce Parent/Child Roles is set to "Enabled" but then page is reloaded to the localhost:3001/home page (unable to determine if PIN input field is shown), and the Parent/Child toggle is set to "Switch to Parent Mode" (meaning, it is in Child Mode now). Only Task Completion and Sparkässeli are shown in the sidebar.
Status: Fail
Tester Note: It is good to see that the toggle to Enforce Parent/Child Roles works. However, the page reload is incorrect.

[Testing Halted]
