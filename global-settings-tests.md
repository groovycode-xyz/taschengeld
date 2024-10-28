# Test Case 1 - Status Bar Default Setting on App Load

Test Date/Time: 2024-10-28 07:19 CEST

**Step 1**
_Action_: npm run dev
_Expected Result:_ Dev server starts without error
_Observed Result:_ Dev server starts without error
_Status:_

**Step 2**
_Action_: Open browser to localhost:3001/
_Expected Result:_ See the "Welcome to Taschengeld" page
_Observed Result_: See the "Welcome to Taschengeld" page
_Status_:

**Step 3**
_Action_: Check the sidebar Parent Mode toggle.
_Expected Result:_ "Switch to Child Mode" is selected and all 5 sidebar items are shown. (i.e. it is in Parent Mode)
_Observed Result:_ "Switch to Child Mode" is selected and all 5 sidebar items are shown. (i.e. it is in Parent Mode)
_Status_:

**Step 4**
_Action_: Go to Global Settings page by clicking on the "Settings" button in the top right corner
_Expected Result:_ See the Global Settings page, Enforce Parent/Child Roles is set to "Enabled", PIN is empty/null/not defined.
_Observed Result:_ See the Global Settings page, Enforce Parent/Child Roles is set to "Enabled", PIN is empty/null/not defined.
_Status_:

**Step 5**
_Action_: Toggle Enforce Parent/Child Roles to "Disabled"
_Expected Result:_ Enforce Parent/Child Roles is set to "Disabled", a modal appears to confirm "Disable Role Enforcement?", clicking "Cancel" does nothing, clicking "Yes, Disable" closes the modal and the page is not reloaded but instead the PIN input field disappears, and on the Sidebar the Parent/Child toggle is set to "Switch to Child Mode (Disabled)" (meaning, it is in Parent Mode now) and all 5 menu items are shown in the sidebar.
_Observed Result:_ Enforce Parent/Child Roles is set to "Disabled", a modal appears to confirm "Disable Role Enforcement?", clicking "Cancel" does nothing, clicking "Yes, Disable" closes the modal and the page is not reloaded but instead the PIN input field disappears, and on the Sidebar the Parent/Child toggle is set to "Switch to Child Mode (Disabled)" (meaning, it is in Parent Mode now) and all 5 menu items are shown in the sidebar.
_Status_:

[Testing Halted]
