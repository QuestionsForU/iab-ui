# Implementation Guide: Conditional Fields on Checkbox

## Overview
This fix enables checkbox fields to conditionally show additional fields when checked. This is useful for workflows like doctor approval where checking a "Doctor Approval" checkbox should display "Doctor Designation" and "Signature" fields.

## Usage Example

### In a Schema Definition File (e.g., `schema/TestResult.jsx`)

```javascript
// Doctor approval form schema
export const doctorApprovalSchema = [
	// ... other fields ...
	{
		text: "Doctor Approval",
		field: "doctorApproved",
		fieldIcon: "user-check",
		type: "check",
		required: false,
		width: 12,
		// This property defines which fields to show when checkbox is checked
		showFields: [
			{
				text: "Doctor Designation",
				field: "doctorDesignation",
				placeholder: "e.g., MD, MBBS, Specialist...",
				fieldIcon: "briefcase",
				required: true,
				width: 6
			},
			{
				text: "Doctor Signature",
				field: "doctorSignature",
				placeholder: "Enter or upload signature...",
				fieldIcon: "pen-fancy",
				required: true,
				width: 6
			}
		]
	}
];
```

### For Edit/Add Schema

```javascript
// In Invoices.jsx or similar file
{
	text: "Doctor Approval",
	field: "doctorApproved",
	type: "check",
	fieldIcon: "stethoscope",
	showFields: [
		{
			text: "Doctor Name",
			field: "doctorName",
			placeholder: "Full name...",
			fieldIcon: "id-card",
			required: true
		},
		{
			text: "Doctor Designation",
			field: "doctorDesignation",
			placeholder: "Designation...",
			fieldIcon: "briefcase",
			required: true
		},
		{
			text: "Signature",
			field: "doctorSignature",
			placeholder: "Signature...",
			fieldIcon: "pen-fancy",
			required: true
		}
	]
}
```

## Form Behavior

### User Interaction Flow
1. **Initial State**: Checkbox is unchecked
   - Only "Doctor Approval" checkbox is visible
   - Dependent fields are hidden

2. **User Checks Checkbox**: 
   ```
   ☑ Doctor Approval
   ```
   - `doctorApproved` field value becomes `true`

3. **Dependent Fields Appear**:
   ```
   ☑ Doctor Approval

   Doctor Designation: [_____________________]
   Doctor Signature: [_____________________]
   ```

4. **User Fills Fields**:
   - Form data updates in real-time
   - Validation works as expected
   - All data is included in the form submission

5. **User Unchecks Checkbox**:
   - Dependent fields are hidden
   - Dependent field data is retained (not cleared)

## Data Structure

When the form is submitted, the data object includes all fields:

```javascript
{
	doctorApproved: true,                    // Boolean - checkbox state
	doctorDesignation: "MD, MBBS",           // String - from dependent field
	doctorSignature: "Dr. John Doe",         // String - from dependent field
	// ... other form fields ...
}
```

## Advanced Options

### Optional Dependent Fields
```javascript
{
	text: "Requires Revision",
	field: "requiresRevision",
	type: "check",
	showFields: [
		{
			text: "Revision Notes",
			field: "revisionNotes",
			placeholder: "Notes...",
			required: false  // Optional field
		}
	]
}
```

### Multiple Field Groups
```javascript
{
	text: "Sample Rejection",
	field: "isSampleRejected",
	type: "check",
	showFields: [
		{
			text: "Rejection Reason",
			field: "rejectionReason",
			placeholder: "Why was sample rejected?",
			fieldIcon: "triangle-exclamation",
			required: true
		},
		{
			text: "Rejected By",
			field: "rejectedBy",
			placeholder: "Technician name",
			fieldIcon: "user",
			required: true
		},
		{
			text: "Remarks",
			field: "rejectionRemarks",
			placeholder: "Additional remarks...",
			fieldIcon: "note",
			required: false
		}
	]
}
```

## Styling & Icons

### Available Font Awesome Icons
Use any Font Awesome solid icon:
- `"user-md"` - Doctor
- `"briefcase"` - Designation
- `"pen-fancy"` - Signature
- `"check"` - Approval
- `"triangle-exclamation"` - Warning
- `"note"` - Notes
- `"id-card"` - ID/Name
- And many more...

### Styling Classes
The dependent fields automatically use:
- Bootstrap form group classes: `position-relative mb-3`
- Validation classes: `is-valid`, `is-invalid`
- Label styling: `fw-bold` (font-weight bold)

## Validation

Dependent fields validate just like regular fields:

```javascript
// In form validation logic
const errors = {
	doctorDesignation: "This field is required",
	// ... other errors
};

// Pass to IUIPageElement
<IUIPageElement
	schema={schema}
	value={formData}
	errors={errors}
	dirty={isDirty}
	onChange={handleChange}
/>
```

## Integration with Existing Forms

The feature is automatically available in all forms using `IUIPageElement` component:

- List forms in `src/pages/common/IUIPage.jsx` ✅
- Add/Edit forms in `src/pages/app/schema/*.jsx` ✅
- Doctor approval forms in `src/pages/app/LISWorkflowPages.jsx` ✅
- Any custom form using the component ✅

## Browser Compatibility

Works with all modern browsers supporting:
- ES6+ JavaScript
- React 18+
- Bootstrap 5+

## Performance Notes

- Dependent fields are rendered conditionally only when checkbox is checked
- No performance impact when checkbox is unchecked
- Form data updates are optimized with React hooks
