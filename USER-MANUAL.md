# iLab UI User Manual

This manual explains how to sign in and use the iLab UI business management application. The screens and available actions can vary by account permissions.

## Contents

- [Getting started](#getting-started)
- [Navigate the application](#navigate-the-application)
- [Use management lists](#use-management-lists)
- [Add or edit a record](#add-or-edit-a-record)
- [Developer guide: creating a module](#developer-guide-creating-a-module)
- [Work with invoices](#work-with-invoices)
- [Profile and account](#profile-and-account)
- [Troubleshooting](#troubleshooting)

## Getting started

1. Open the application URL provided by your organization.
2. Enter your registered email address and password on the sign-in page.
3. Select **Login**. If sign-in succeeds, the dashboard opens.

Access requires an account created or authorized by your system administrator. If you do not have an account or cannot sign in, contact the administrator. The **Recover Password** link currently directs users to contact the administrator; password recovery is not self-service.

The dashboard welcomes you and displays the name and email associated with your signed-in account.

## Navigate the application

Use the left-hand navigation menu to open a section. The menu may be collapsed on smaller screens; use the menu toggle to show or hide it. Sections and options may be hidden if your account does not have access.

| Menu section | Available screens |
| --- | --- |
| Dashboard | Dashboard |
| Inventory | Suppliers, Product Type, Product |
| Sales | Invoice |
| Customer | Customer |
| Configuration | User Management, Role Management (administrator accounts) |

Menu items can be hidden if your account lacks the required module privilege. The Configuration section is shown only to users with an `admin` role. Other screens may still have routes in the application without appearing in the current menu.

Select your name/profile area in the top-right corner to access **Change Password**, **View Profile**, and **Logout**. Use **Logout** when finished, especially on a shared computer.

## Use management lists

Most management sections open a list of existing records.

- **Open a record:** Select its linked name or identifier in the list.
- **Edit a record:** Select the pencil icon on its row, or open the record and select **Edit** if available.
- **Search:** Enter a search term in the Search box and select **Search**. Searchable fields vary by section.
- **Sort:** Select a sortable column heading to change the sort order.
- **Change pages or show more:** Use the page controls or **Show more** at the bottom of a paginated list, when present.
- **Add:** Select **Add New** if the button is available and your account permits it.

Not every section supports all of these actions. For example, the current Customer list does not show an Add New action, and some records may only be viewable or editable. The application does not currently provide a general delete action in these lists.

## Add or edit a record

1. Open the appropriate section from the navigation menu.
2. Select **Add New** to create a record, or open a record and select **Edit**.
3. Enter the requested information. Required fields are indicated on the form; selection fields may offer predefined options or values from another section.
4. Review the information and select **Save**.
5. If you do not want to keep your changes, select **Cancel**.

If the application marks a field as required or displays a validation message, correct the field before saving. You may need to maintain related records first—for example, a product refers to a product type, and invoice items refer to products.

### Examples of information requested

- **Product:** Product type, name, price, quantity, and optional product image.
- **Supplier:** Name, email, GST number, phone number, address, and optional profile picture.
- **Customer:** Name, phone number, PAN number, and address when editing an existing record.

The exact fields and required values depend on the section and may change as the application is updated.

## Developer guide: creating a module

A module in this application is more than a form. To add one, connect its Firestore collection and reusable page schemas to the router and navigation menu, then provide any required Firestore indexes and access configuration. The Invoice module is an example: its page components are in `src/pages/app/schema/Invoices.jsx`, its routes are registered in `src/routes/index.jsx`, its menu entry is in `src/pages/common/LeftMenu.jsx`, and its collection indexes are in `firestore.indexes.json`.

### 1. Choose the module and route names

Decide on:

- A singular Firestore collection/module name, such as `invoice`.
- A route path, such as `/invoices`.
- A display label and the menu group where users should find it.
- The fields, relationships, and allowed actions (list, search, add, view, edit).

The module name is passed to the shared data components as `schema.module`; it must match the Firestore collection name. Existing routes usually use a plural path, but the shared page component constructs some navigation paths by appending `s` to the module name. Keep module and route naming consistent, and inspect the resulting add/view/edit/back URLs—especially for irregular plurals or names with multiple words.

### 2. Create the module page schemas

Create `src/pages/app/schema/<ModuleName>.jsx` (for example, `Invoices.jsx`). A module exports its own screen components, conventionally named `<Module>List`, `<Module>View`, `<Module>Add`, and `<Module>Edit`. These screen components use the shared list and form components. For example, a module named `Example` can export `ExampleList`, `ExampleView`, `ExampleAdd`, and `ExampleEdit`. The current Invoice file uses the older `ListInvoice`, `ViewInvoice`, `AddInvoice`, and `EditInvoice` naming; either convention works as long as the exports, imports, and route references match. Replace `example`, labels, and fields below with the new module's values:

```jsx
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";

const moduleSchema = {
  module: "example",
  title: "Example Management",
};

const formFields = [
  {
    type: "area",
    fields: [
      { text: "Name", field: "name", type: "text", required: true, width: 6 },
      { text: "Description", field: "description", type: "textarea", required: false, width: 12 },
    ],
  },
];

export const ExampleList = () => (
  <IUIList
    schema={{
      ...moduleSchema,
      paging: true,
      searching: true,
      editing: true,
      adding: true,
      fields: [
        { text: "Name", field: "name", type: "link", sorting: true, searching: true },
        { text: "Description", field: "description", type: "text", sorting: false, searching: false },
      ],
    }}
  />
);

export const ExampleView = () => (
  <IUIPage
    schema={{
      ...moduleSchema,
      editing: true,
      adding: false,
      back: true,
      readonly: true,
      fields: formFields,
    }}
  />
);

export const ExampleAdd = () => (
  <IUIPage
    schema={{
      ...moduleSchema,
      back: false,
      fields: formFields,
    }}
  />
);

export const ExampleEdit = () => (
  <IUIPage
    schema={{
      ...moduleSchema,
      back: false,
      fields: formFields,
    }}
  />
);
```

In the code above, `ExampleList`, `ExampleView`, `ExampleAdd`, and `ExampleEdit` are the module's route-level screens. They are built with the shared `IUIList` list renderer and `IUIPage` form renderer used elsewhere in the project. A list field with `type: "link"` opens the view route. The form renderer uses the route's `:id` parameter to load or update an existing document, and creates a document when the add route has no `id`. For a view schema, set `readonly: true`; `editing: true` displays the **Edit** action. Add and edit forms are writable schemas without `readonly`.

Use separate schema objects when form fields or read-only/action settings differ, as the Invoice screens do. Form fields are described in `fields`; common properties include `text`, `field`, `type`, `required`, and `width`. Use existing schemas for field types, lookups, and inline relations. For linked lookup values, specify the related collection in the field's `schema.module`; for fixed choices, provide `schema.items`.

### 3. Register the routes

In `src/routes/index.jsx`:

1. Import each exported component from the new schema file.
2. Add its paths inside the authenticated route's `children`.
3. Register the module's list, view, add, and edit screens, typically:

```jsx
{ path: "/examples", element: <ExampleList /> },
{ path: "/examples/:id", element: <ExampleView /> },
{ path: "/examples/add", element: <ExampleAdd /> },
{ path: "/examples/:id/edit", element: <ExampleEdit /> },
```

Follow the actual Invoice route declarations in this file. Add and edit routes are separate from list/view routes; defining a page component alone does not make it reachable.

### 4. Add the navigation item

In `src/pages/common/LeftMenu.jsx`, add a menu item under the appropriate section. For example:

```jsx
{ name: "example", text: "Example", icon: "box-open", path: "/examples", access: "example" }
```

The menu item path must match the list route. The menu and router are separate registrations, so update both. When using `access`, its value must match the privilege module name (`example`). Add the new module to the fixed `modules` array in `src/pages/common/shared/IUIRolePrivilege.jsx`; otherwise Role Management will not offer privileges for it. Then grant the intended `list`, `view`, `add`, `edit`, or `delete` privileges through Role Management and assign the role to users. The menu checks for a privilege matching the module, while page actions use these privilege names. This is UI behavior only: a menu entry, route, or role setting does not secure Firestore data; enforce access in Firestore rules too.

### 5. Add Firestore indexes when needed

The shared list query in `src/store/firebase-service.js` filters on `application`. Unless a screen supplies another sort, it sorts most collections by `dateCreated` descending; invoices currently default to `name` descending. The list schema can also expose sort actions for other fields, and search adds field filters. Add indexes to `firestore.indexes.json` for the actual collection, filters, and sort combinations used by the new module. A common default index pattern for a collection sorted by `dateCreated` descending is:

```json
{
  "collectionGroup": "example",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "application", "order": "ASCENDING" },
    { "fieldPath": "dateCreated", "order": "DESCENDING" }
  ]
}
```

Use the Firestore module/collection name for `collectionGroup` (for example, `invoice`). For other sort fields, create matching ascending/descending index entries as required by the queries. If Firestore reports a missing index, review its suggested definition, add it to the checked-in file, and deploy it to the intended Firebase project:

```powershell
firebase deploy --project <project-id> --only firestore:indexes
```

### 6. Check data metadata, access, and relationships

`src/store/firebase-service.js` adds shared metadata when creating documents, including `status`, `schema`, `user`, `dateCreated`, `application`, and `access`. Understand these defaults and verify they are appropriate before relying on them. Review Firestore rules for the new collection; do not assume client-side menu visibility or form permissions provide database security.

If a screen uses child/related records, study `module-relation-inline` in the Invoice schemas and the shared relation component before copying the pattern. Confirm how the relation is stored and queried, and ensure the related collection, lookup fields, routes (if needed), and indexes are all in place.

### 7. Review every registration point

For a new module, check the relevant files as a set:

| Concern | File |
| --- | --- |
| List, view, add, and edit screen schemas | `src/pages/app/schema/<ModuleName>.jsx` |
| Route imports and route paths | `src/routes/index.jsx` |
| Menu section, path, and module access key | `src/pages/common/LeftMenu.jsx` |
| Available role privilege modules/actions | `src/pages/common/shared/IUIRolePrivilege.jsx` |
| Firestore indexes for the collection's queries | `firestore.indexes.json` |
| Firestore authorization for collection reads/writes | `firestore.rules` |

Not every module requires edits to every file: add indexes when the queries need them, and add related-record handling only when the module has relationships. But confirm each concern has been addressed before considering the module complete.

### 8. Verify the complete user flow

- Confirm the menu entry opens the list route.
- Test list loading, search, sorting, and pagination if enabled.
- Test add, save, view, edit, cancel, required-field validation, and related lookups as applicable.
- Test with accounts that should and should not have access.
- Check browser console and Firestore errors; add and deploy any required index.
- Verify Firestore rules and deploy only to the approved Firebase project.

## Work with invoices

1. Open **Sales → Invoice**.
2. Select **Add New** if available.
3. Enter the invoice date, customer name, email, phone number, and address. PAN/GST number and GST percentage are optional in the current form. The invoice number is displayed as a read-only field.
4. Add invoice items using the product lookup, then enter quantity and price. The item total is read-only.
5. Review the invoice and select **Save**.

The invoice list displays invoice ID, customer name, phone number, and invoice date. Use its search, column sorting, page controls, or **Show more** as needed. When viewing an existing invoice, use **Edit** if you need to make a permitted correction. Confirm customer and item details before saving. If an expected action is not available, ask your administrator to check your permissions or the application's current configuration.

## Profile and account

Open the profile menu in the top-right corner:

- **View Profile:** Review your profile details.
- **Change Password:** Open the password change screen and follow its prompts.
- **Logout:** End your current session.

If you forget your password, use **Recover Password** on the sign-in page to see the administrator contact instruction. If your account is locked, missing a menu section, or has incorrect details, contact your system administrator.

## Troubleshooting

| Problem | What to try |
| --- | --- |
| Login fails | Check your email and password, then try again. If the problem continues, contact the administrator. |
| A section or button is missing | Your account may not have permission, or that action may not be enabled in the current application. Contact the administrator. |
| A record cannot be saved | Check required fields and any validation messages. Make sure related records selected in lookup fields exist. |
| A list is empty or search returns no results | Clear the search and select **Search** again. Check that you are in the correct section. |
| A page displays an error or remains blank | Refresh the page once. If it continues, note the section and action you were performing and report it to support. |

Do not share your password. When reporting a problem, provide the page/section and a description of the steps that led to it; do not send passwords or sensitive customer information.
